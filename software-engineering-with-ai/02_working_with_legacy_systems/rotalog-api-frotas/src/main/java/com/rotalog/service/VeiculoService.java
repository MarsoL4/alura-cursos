package com.rotalog.service;

import com.rotalog.domain.Veiculo;
import com.rotalog.dto.EstatisticasFrotaResponse;
import com.rotalog.exception.PlacaDuplicadaException;
import com.rotalog.exception.ResourceNotFoundException;
import com.rotalog.exception.VeiculoNotFoundException;
import com.rotalog.exception.VeiculoStatusInvalidoException;
import com.rotalog.exception.VeiculoValidacaoException;
import com.rotalog.model.VeiculoStatus;
import com.rotalog.repository.VeiculoRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
public class VeiculoService {

	private final VeiculoRepository veiculoRepository;
	private final VeiculoNotificacaoService veiculoNotificacaoService;
	private final VeiculoManutencaoService veiculoManutencaoService;

	public VeiculoService(
		VeiculoRepository veiculoRepository,
		VeiculoNotificacaoService veiculoNotificacaoService,
		VeiculoManutencaoService veiculoManutencaoService
	) {
		this.veiculoRepository = veiculoRepository;
		this.veiculoNotificacaoService = veiculoNotificacaoService;
		this.veiculoManutencaoService = veiculoManutencaoService;
	}

	public List<Veiculo> listarTodos() {
		log.info("Listando todos os veículos");
		return veiculoRepository.findAll();
	}

	public Veiculo buscarPorId(Long id) {
		return veiculoRepository.findById(id)
			.orElseThrow(() -> new ResourceNotFoundException("Veículo não encontrado: " + id));
	}

	public Veiculo buscarPorPlaca(String placa) {
		return veiculoRepository.findByPlaca(placa)
			.orElseThrow(() -> new VeiculoNotFoundException("Veículo não encontrado com placa: " + placa));
	}

	public Veiculo registrarVeiculo(String placa, String modelo, Integer anoFabricacao) {
		if (placa == null || placa.isEmpty()) {
			throw new VeiculoValidacaoException("Placa é obrigatória");
		}

		if (placa.length() != 7) {
			throw new VeiculoValidacaoException("Placa deve ter 7 caracteres");
		}

		if (veiculoRepository.findByPlaca(placa).isPresent()) {
			throw new PlacaDuplicadaException("Veículo com placa " + placa + " já existe");
		}

		if (modelo == null || modelo.isEmpty()) {
			throw new VeiculoValidacaoException("Modelo é obrigatório");
		}

		if (anoFabricacao == null || anoFabricacao < 1900 || anoFabricacao > 2100) {
			throw new VeiculoValidacaoException("Ano de fabricação inválido");
		}

		Veiculo veiculo = new Veiculo();
		veiculo.setPlaca(placa.toUpperCase());
		veiculo.setModelo(modelo);
		veiculo.setAnoFabricacao(anoFabricacao);
		veiculo.setStatus(VeiculoStatus.ATIVO.name());
		veiculo.setQuilometragem(0L);
		veiculo.setDataCadastro(LocalDateTime.now());
		veiculo.setDataAtualizacao(LocalDateTime.now());

		Veiculo salvo = veiculoRepository.save(veiculo);
		log.info("Veículo registrado: {} - {}", salvo.getPlaca(), salvo.getModelo());

		veiculoNotificacaoService.notificarNovoVeiculo(salvo.getPlaca(), salvo.getModelo());

		return salvo;
	}

	public Veiculo atualizarVeiculo(Long id, String modelo, Integer anoFabricacao, Long quilometragem) {
		Veiculo veiculo = buscarPorId(id);

		if (modelo != null && !modelo.isEmpty()) {
			veiculo.setModelo(modelo);
		}
		if (anoFabricacao != null) {
			veiculo.setAnoFabricacao(anoFabricacao);
		}
		if (quilometragem != null) {
			if (quilometragem < veiculo.getQuilometragem()) {
				log.warn("Tentativa de reduzir quilometragem do veículo {}: {} -> {}",
					id, veiculo.getQuilometragem(), quilometragem);
			}
			veiculo.setQuilometragem(quilometragem);
		}

		veiculo.setDataAtualizacao(LocalDateTime.now());
		return veiculoRepository.save(veiculo);
	}

	public Veiculo atualizarQuilometragem(Long veiculoId, Long novaQuilometragem) {
		Veiculo veiculo = buscarPorId(veiculoId);

		if (novaQuilometragem == null || novaQuilometragem < 0) {
			throw new VeiculoValidacaoException("Quilometragem não pode ser negativa");
		}

		if (novaQuilometragem < veiculo.getQuilometragem()) {
			log.warn("Quilometragem informada ({}) é menor que a atual ({})", novaQuilometragem, veiculo.getQuilometragem());
		}

		veiculo.setQuilometragem(novaQuilometragem);
		veiculo.setDataAtualizacao(LocalDateTime.now());

		Veiculo atualizado = veiculoRepository.save(veiculo);

		if (veiculoManutencaoService.precisaDeManutencao(atualizado)) {
			veiculoNotificacaoService.notificarAlertaManutencao(veiculo.getPlaca(), novaQuilometragem);
		}

		return atualizado;
	}

	public List<Veiculo> obterVeiculosPorStatus(String status) {
		try {
			VeiculoStatus.fromString(status);
		} catch (IllegalArgumentException e) {
			throw new VeiculoStatusInvalidoException("Status inválido: " + status);
		}
		return veiculoRepository.findByStatus(status);
	}

	public void agendarManutencaoPreventiva(Long veiculoId, Long quilometragemLimite) {
		Veiculo veiculo = buscarPorId(veiculoId);

		veiculoManutencaoService.agendarManutencaoPreventiva(veiculo, quilometragemLimite);

		log.info("Manutenção preventiva agendada para veículo {} em {} km",
			veiculo.getPlaca(), quilometragemLimite);

		veiculoNotificacaoService.notificarManutencaoAgendada(veiculo.getPlaca(), quilometragemLimite);
	}

	public Double calcularCustoManutencao(String modelo, Long quilometragem) {
		return veiculoManutencaoService.calcularCustoManutencao(quilometragem);
	}

	public Boolean precisaDeManutencao(Long veiculoId) {
		Veiculo veiculo = buscarPorId(veiculoId);
		return veiculoManutencaoService.precisaDeManutencao(veiculo);
	}

	public Veiculo desativarVeiculo(Long veiculoId) {
		Veiculo veiculo = buscarPorId(veiculoId);
		veiculo.setStatus(VeiculoStatus.INATIVO.name());
		veiculo.setDataAtualizacao(LocalDateTime.now());

		Veiculo desativado = veiculoRepository.save(veiculo);
		log.info("Veículo desativado: {}", veiculo.getPlaca());

		veiculoNotificacaoService.notificarVeiculoDesativado(veiculo.getPlaca());

		return desativado;
	}

	public Veiculo reativarVeiculo(Long veiculoId) {
		Veiculo veiculo = buscarPorId(veiculoId);
		veiculo.setStatus(VeiculoStatus.ATIVO.name());
		veiculo.setDataAtualizacao(LocalDateTime.now());

		log.info("Veículo reativado: {}", veiculo.getPlaca());
		return veiculoRepository.save(veiculo);
	}

	public EstatisticasFrotaResponse obterEstatisticasFrota() {
		long total = veiculoRepository.count();
		long ativos = veiculoRepository.countByStatus(VeiculoStatus.ATIVO.name());
		long inativos = veiculoRepository.countByStatus(VeiculoStatus.INATIVO.name());
		long emManutencao = veiculoRepository.countByStatus(VeiculoStatus.MANUTENCAO.name());

		return new EstatisticasFrotaResponse(total, ativos, inativos, emManutencao);
	}

	public void sincronizarComSistemaExterno() {
		log.info("Sincronização com sistema externo iniciada");
	}
}
