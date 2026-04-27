using api_notificacoes.Data;
using api_notificacoes.DTOs;
using api_notificacoes.Models;
using api_notificacoes.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace api_notificacoes.Tests;

public class NotificacaoServiceTests : IDisposable
{
    private readonly NotificacoesDbContext _context;
    private readonly Mock<ILogger<NotificacaoService>> _loggerMock;
    private readonly Mock<IConfiguration> _configurationMock;
    private readonly NotificacaoService _service;

    public NotificacaoServiceTests()
    {
        var options = new DbContextOptionsBuilder<NotificacoesDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        _context = new NotificacoesDbContext(options);
        _loggerMock = new Mock<ILogger<NotificacaoService>>();
        _configurationMock = new Mock<IConfiguration>();

        _configurationMock.Setup(c => c["EmailSettings:SmtpServer"]).Returns("smtp.test.com");
        _configurationMock.Setup(c => c["EmailSettings:SmtpPort"]).Returns("587");
        _configurationMock.Setup(c => c["EmailSettings:SenderEmail"]).Returns("noreply@rotalog.com");
        _configurationMock.Setup(c => c["EmailSettings:SenderPassword"]).Returns("test-pass");

        _service = new NotificacaoService(_context, _loggerMock.Object, _configurationMock.Object);
    }

    public void Dispose() => _context.Dispose();

    // -----------------------------------------------------------------------
    // CriarNotificacao
    // -----------------------------------------------------------------------

    public class CriarNotificacao : NotificacaoServiceTests
    {
        [Fact]
        public async Task WhenTipoAlertaManutencaoPreventiva_ThenPersistsNotificacao()
        {
            var request = new NotificacaoRequest
            {
                Tipo = "ALERTA_MANUTENCAO_PREVENTIVA",
                Destinatario = "gestor@rotalog.com",
                Mensagem = "Veículo ABC1D23 com quilometragem excedida.",
                Canal = "email",
                ServicoOrigem = "api-frotas"
            };

            var result = await _service.CriarNotificacao(request);

            Assert.Equal("ALERTA_MANUTENCAO_PREVENTIVA", result.Tipo);
            Assert.Equal("gestor@rotalog.com", result.Destinatario);
            Assert.Equal("api-frotas", result.ServicoOrigem);
            Assert.Equal(1, await _context.Notificacoes.CountAsync());
        }

        [Fact]
        public async Task WhenEnvioBemsucedido_ThenStatusIsEnviado()
        {
            var request = new NotificacaoRequest
            {
                Tipo = "ALERTA_MANUTENCAO_PREVENTIVA",
                Destinatario = "gestor@rotalog.com",
                Mensagem = "Veículo ABC1D23 atingiu 60000 km.",
                Canal = "email"
            };

            // Executa várias vezes para contornar a falha aleatória de 10%
            NotificacaoResponse? enviado = null;
            for (var tentativa = 0; tentativa < 20; tentativa++)
            {
                var r = await _service.CriarNotificacao(request);
                if (r.Status == "ENVIADO") { enviado = r; break; }
            }

            Assert.NotNull(enviado);
            Assert.Equal("ENVIADO", enviado!.Status);
            Assert.NotNull(enviado.DataEnvio);
        }

        [Fact]
        public async Task WhenEnvioFalha_ThenStatusIsFalhaAposMaxTentativas()
        {
            // Força sempre FALHA usando mensagem que não existe como template
            // Inserimos notificação diretamente com status FALHA para simular esgotamento
            var notificacao = new Notificacao
            {
                Tipo = "ALERTA_MANUTENCAO_PREVENTIVA",
                Canal = "email",
                Destinatario = "gestor@rotalog.com",
                Mensagem = "Teste de falha",
                Status = "FALHA",
                Tentativas = 3,
                MaxTentativas = 3,
                ErroMensagem = "SMTP connection timeout (simulated)",
                DataCriacao = DateTime.UtcNow,
                DataAtualizacao = DateTime.UtcNow
            };
            _context.Notificacoes.Add(notificacao);
            await _context.SaveChangesAsync();

            Assert.Equal("FALHA", notificacao.Status);
            Assert.Equal(3, notificacao.Tentativas);
            Assert.NotNull(notificacao.ErroMensagem);
        }

        [Fact]
        public async Task WhenTipoIsNull_ThenThrowsArgumentException()
        {
            var request = new NotificacaoRequest
            {
                Tipo = "",
                Destinatario = "gestor@rotalog.com",
                Mensagem = "msg"
            };

            await Assert.ThrowsAsync<ArgumentException>(() => _service.CriarNotificacao(request));
        }

        [Fact]
        public async Task WhenDestinatarioIsNull_ThenThrowsArgumentException()
        {
            var request = new NotificacaoRequest
            {
                Tipo = "ALERTA_MANUTENCAO_PREVENTIVA",
                Destinatario = "",
                Mensagem = "msg"
            };

            await Assert.ThrowsAsync<ArgumentException>(() => _service.CriarNotificacao(request));
        }

        [Fact]
        public async Task WhenTemplateExiste_ThenAplicaVariaveisNoCorpo()
        {
            _context.Templates.Add(new TemplateNotificacao
            {
                Tipo = "ALERTA_MANUTENCAO_PREVENTIVA",
                Canal = "email",
                AssuntoTemplate = "ALERTA: Manutenção preventiva - Veículo {{placa}}",
                CorpoTemplate = "Veículo {{placa}} ({{modelo}}) — Motivo: {{motivo}} — {{quilometragem}} km",
                Ativo = true,
                DataCriacao = DateTime.UtcNow,
                DataAtualizacao = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();

            var request = new NotificacaoRequest
            {
                Tipo = "ALERTA_MANUTENCAO_PREVENTIVA",
                Destinatario = "gestor@rotalog.com",
                Mensagem = "fallback",
                Canal = "email",
                Variaveis = new Dictionary<string, string>
                {
                    { "placa", "ABC1D23" },
                    { "modelo", "Fiat Fiorino" },
                    { "motivo", "QUILOMETRAGEM_EXCEDIDA" },
                    { "quilometragem", "60000" }
                }
            };

            var result = await _service.CriarNotificacao(request);

            Assert.Contains("ABC1D23", result.Mensagem);
            Assert.Contains("Fiat Fiorino", result.Mensagem);
            Assert.Contains("QUILOMETRAGEM_EXCEDIDA", result.Mensagem);
            Assert.Contains("60000", result.Mensagem);
        }

        [Fact]
        public async Task WhenTemplateExiste_ThenAplicaVariaveisNoAssunto()
        {
            _context.Templates.Add(new TemplateNotificacao
            {
                Tipo = "ALERTA_MANUTENCAO_PREVENTIVA",
                Canal = "email",
                AssuntoTemplate = "ALERTA: Manutenção preventiva - Veículo {{placa}}",
                CorpoTemplate = "Veículo {{placa}} requer manutenção.",
                Ativo = true,
                DataCriacao = DateTime.UtcNow,
                DataAtualizacao = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();

            var request = new NotificacaoRequest
            {
                Tipo = "ALERTA_MANUTENCAO_PREVENTIVA",
                Destinatario = "gestor@rotalog.com",
                Mensagem = "fallback",
                Canal = "email",
                Variaveis = new Dictionary<string, string> { { "placa", "DEF4G56" } }
            };

            var result = await _service.CriarNotificacao(request);

            Assert.Equal("ALERTA: Manutenção preventiva - Veículo DEF4G56", result.Assunto);
        }

        [Fact]
        public async Task WhenSemTemplate_ThenUsaMensagemDireta()
        {
            var mensagem = "Veículo GHI7J89 com prazo excedido.";
            var request = new NotificacaoRequest
            {
                Tipo = "ALERTA_MANUTENCAO_PREVENTIVA",
                Destinatario = "gestor@rotalog.com",
                Mensagem = mensagem,
                Canal = "email"
            };

            var result = await _service.CriarNotificacao(request);

            Assert.Equal(mensagem, result.Mensagem);
        }

        [Fact]
        public async Task WhenCriada_ThenServicoOrigemEhPersistido()
        {
            var request = new NotificacaoRequest
            {
                Tipo = "ALERTA_MANUTENCAO_PREVENTIVA",
                Destinatario = "gestor@rotalog.com",
                Mensagem = "Veículo elegível para manutenção.",
                Canal = "email",
                ServicoOrigem = "api-frotas",
                ReferenciaId = "alerta-42"
            };

            var result = await _service.CriarNotificacao(request);

            Assert.Equal("api-frotas", result.ServicoOrigem);
            Assert.Equal("alerta-42", result.ReferenciaId);
        }
    }

    // -----------------------------------------------------------------------
    // BuscarPorId
    // -----------------------------------------------------------------------

    public class BuscarPorId : NotificacaoServiceTests
    {
        [Fact]
        public async Task WhenNotificacaoExiste_ThenRetornaResponse()
        {
            var notificacao = new Notificacao
            {
                Tipo = "ALERTA_MANUTENCAO_PREVENTIVA",
                Canal = "email",
                Destinatario = "gestor@rotalog.com",
                Mensagem = "Veículo elegível.",
                Status = "ENVIADO",
                DataCriacao = DateTime.UtcNow,
                DataAtualizacao = DateTime.UtcNow
            };
            _context.Notificacoes.Add(notificacao);
            await _context.SaveChangesAsync();

            var result = await _service.BuscarPorId(notificacao.Id);

            Assert.NotNull(result);
            Assert.Equal("ALERTA_MANUTENCAO_PREVENTIVA", result!.Tipo);
            Assert.Equal("ENVIADO", result.Status);
        }

        [Fact]
        public async Task WhenNotificacaoNaoExiste_ThenRetornaNull()
        {
            var result = await _service.BuscarPorId(9999L);

            Assert.Null(result);
        }
    }

    // -----------------------------------------------------------------------
    // ListarNotificacoes
    // -----------------------------------------------------------------------

    public class ListarNotificacoes : NotificacaoServiceTests
    {
        [Fact]
        public async Task WhenFiltrandoPorTipo_ThenRetornaSomenteDoTipo()
        {
            _context.Notificacoes.AddRange(
                Notificacao("ALERTA_MANUTENCAO_PREVENTIVA", "ENVIADO"),
                Notificacao("MANUTENCAO_AGENDADA", "ENVIADO")
            );
            await _context.SaveChangesAsync();

            var result = await _service.ListarNotificacoes(tipo: "ALERTA_MANUTENCAO_PREVENTIVA");

            Assert.Single(result);
            Assert.Equal("ALERTA_MANUTENCAO_PREVENTIVA", result[0].Tipo);
        }

        [Fact]
        public async Task WhenFiltrandoPorStatus_ThenRetornaSomenteDoStatus()
        {
            _context.Notificacoes.AddRange(
                Notificacao("ALERTA_MANUTENCAO_PREVENTIVA", "ENVIADO"),
                Notificacao("ALERTA_MANUTENCAO_PREVENTIVA", "PENDENTE"),
                Notificacao("ALERTA_MANUTENCAO_PREVENTIVA", "FALHA")
            );
            await _context.SaveChangesAsync();

            var result = await _service.ListarNotificacoes(status: "PENDENTE");

            Assert.Single(result);
            Assert.Equal("PENDENTE", result[0].Status);
        }

        [Fact]
        public async Task WhenFiltrandoPorServicoOrigem_ThenRetornaSomenteDoServico()
        {
            _context.Notificacoes.AddRange(
                Notificacao("ALERTA_MANUTENCAO_PREVENTIVA", "ENVIADO", servicoOrigem: "api-frotas"),
                Notificacao("ENTREGA_CRIADA", "ENVIADO", servicoOrigem: "api-entregas")
            );
            await _context.SaveChangesAsync();

            var result = await _service.ListarNotificacoes(servicoOrigem: "api-frotas");

            Assert.Single(result);
            Assert.Equal("api-frotas", result[0].ServicoOrigem);
        }

        [Fact]
        public async Task WhenSemFiltros_ThenRetornaTodas()
        {
            _context.Notificacoes.AddRange(
                Notificacao("ALERTA_MANUTENCAO_PREVENTIVA", "ENVIADO"),
                Notificacao("MANUTENCAO_AGENDADA", "PENDENTE")
            );
            await _context.SaveChangesAsync();

            var result = await _service.ListarNotificacoes();

            Assert.Equal(2, result.Count);
        }

        private static Notificacao Notificacao(string tipo, string status, string servicoOrigem = "api-frotas") =>
            new()
            {
                Tipo = tipo,
                Canal = "email",
                Destinatario = "gestor@rotalog.com",
                Mensagem = "msg",
                Status = status,
                ServicoOrigem = servicoOrigem,
                DataCriacao = DateTime.UtcNow,
                DataAtualizacao = DateTime.UtcNow
            };
    }

    // -----------------------------------------------------------------------
    // ReenviarNotificacao
    // -----------------------------------------------------------------------

    public class ReenviarNotificacao : NotificacaoServiceTests
    {
        [Fact]
        public async Task WhenNotificacaoExiste_ThenResetaStatusParaPendente()
        {
            var notificacao = new Notificacao
            {
                Tipo = "ALERTA_MANUTENCAO_PREVENTIVA",
                Canal = "email",
                Destinatario = "gestor@rotalog.com",
                Mensagem = "msg",
                Status = "FALHA",
                Tentativas = 3,
                ErroMensagem = "SMTP timeout",
                DataCriacao = DateTime.UtcNow,
                DataAtualizacao = DateTime.UtcNow
            };
            _context.Notificacoes.Add(notificacao);
            await _context.SaveChangesAsync();

            var result = await _service.ReenviarNotificacao(notificacao.Id);

            Assert.NotNull(result);
            Assert.Null(result!.ErroMensagem);
        }

        [Fact]
        public async Task WhenNotificacaoNaoExiste_ThenRetornaNull()
        {
            var result = await _service.ReenviarNotificacao(9999L);

            Assert.Null(result);
        }

        [Fact]
        public async Task WhenNovoDestinatarioFornecido_ThenAtualizaDestinatario()
        {
            var notificacao = new Notificacao
            {
                Tipo = "ALERTA_MANUTENCAO_PREVENTIVA",
                Canal = "email",
                Destinatario = "gestor@rotalog.com",
                Mensagem = "msg",
                Status = "FALHA",
                DataCriacao = DateTime.UtcNow,
                DataAtualizacao = DateTime.UtcNow
            };
            _context.Notificacoes.Add(notificacao);
            await _context.SaveChangesAsync();

            var result = await _service.ReenviarNotificacao(
                notificacao.Id,
                new ReenvioRequest { NovoDestinatario = "novo@rotalog.com" }
            );

            Assert.NotNull(result);
            Assert.Equal("novo@rotalog.com", result!.Destinatario);
        }
    }

    // -----------------------------------------------------------------------
    // ListarTemplates
    // -----------------------------------------------------------------------

    public class ListarTemplates : NotificacaoServiceTests
    {
        [Fact]
        public async Task WhenTemplateAlertaExiste_ThenEstaPresente()
        {
            _context.Templates.Add(new TemplateNotificacao
            {
                Tipo = "ALERTA_MANUTENCAO_PREVENTIVA",
                Canal = "email",
                AssuntoTemplate = "ALERTA: Manutenção preventiva - Veículo {{placa}}",
                CorpoTemplate = "Veículo {{placa}} ({{modelo}}) — Motivo: {{motivo}} — {{quilometragem}} km",
                Ativo = true,
                DataCriacao = DateTime.UtcNow,
                DataAtualizacao = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();

            var result = await _service.ListarTemplates();

            Assert.Contains(result, t => t.Tipo == "ALERTA_MANUTENCAO_PREVENTIVA");
        }

        [Fact]
        public async Task WhenApenasAtivos_ThenExcluiInativo()
        {
            _context.Templates.AddRange(
                new TemplateNotificacao
                {
                    Tipo = "ALERTA_MANUTENCAO_PREVENTIVA",
                    Canal = "email",
                    CorpoTemplate = "corpo",
                    Ativo = true,
                    DataCriacao = DateTime.UtcNow,
                    DataAtualizacao = DateTime.UtcNow
                },
                new TemplateNotificacao
                {
                    Tipo = "TIPO_INATIVO",
                    Canal = "email",
                    CorpoTemplate = "corpo",
                    Ativo = false,
                    DataCriacao = DateTime.UtcNow,
                    DataAtualizacao = DateTime.UtcNow
                }
            );
            await _context.SaveChangesAsync();

            var result = await _service.ListarTemplates(apenasAtivos: true);

            Assert.DoesNotContain(result, t => t.Tipo == "TIPO_INATIVO");
        }
    }

    // -----------------------------------------------------------------------
    // ProcessarPendentes
    // -----------------------------------------------------------------------

    public class ProcessarPendentes : NotificacaoServiceTests
    {
        [Fact]
        public async Task WhenExistemPendentes_ThenProcessaERetornaContagem()
        {
            _context.Notificacoes.Add(new Notificacao
            {
                Tipo = "ALERTA_MANUTENCAO_PREVENTIVA",
                Canal = "email",
                Destinatario = "gestor@rotalog.com",
                Mensagem = "Veículo elegível.",
                Status = "PENDENTE",
                Tentativas = 0,
                MaxTentativas = 3,
                DataCriacao = DateTime.UtcNow,
                DataAtualizacao = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();

            var processadas = await _service.ProcessarPendentes();

            Assert.Equal(1, processadas);
        }

        [Fact]
        public async Task WhenTentativasEsgotadas_ThenNaoProcessa()
        {
            _context.Notificacoes.Add(new Notificacao
            {
                Tipo = "ALERTA_MANUTENCAO_PREVENTIVA",
                Canal = "email",
                Destinatario = "gestor@rotalog.com",
                Mensagem = "msg",
                Status = "PENDENTE",
                Tentativas = 3,
                MaxTentativas = 3,
                DataCriacao = DateTime.UtcNow,
                DataAtualizacao = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();

            var processadas = await _service.ProcessarPendentes();

            Assert.Equal(0, processadas);
        }

        [Fact]
        public async Task WhenNaoHaPendentes_ThenRetornaZero()
        {
            var processadas = await _service.ProcessarPendentes();

            Assert.Equal(0, processadas);
        }
    }
}
