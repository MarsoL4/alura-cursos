package com.rotalog.service;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

/**
 * NotificacaoClient - HTTP client for api-notificacoes
 * 
 * FIXME: URL hardcoded
 * FIXME: Sem circuit breaker
 * FIXME: Sem retry logic
 * FIXME: Sem timeout configurável
 * FIXME: RestTemplate instanciado manualmente em vez de ser Bean
 */
@Slf4j
@Component
public class NotificacaoClient {

    // FIXME: URL hardcoded - deveria estar em application.properties
    private static final String NOTIFICACAO_API_URL = "http://localhost:5000";

    // FIXME: RestTemplate criado manualmente - deveria ser @Bean injetado
    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Envia notificação para api-notificacoes
     * 
     * FIXME: Sem retry
     * FIXME: Sem fallback
     * FIXME: Sem validação de resposta
     * FIXME: Engolindo exceções no chamador
     */
    public String enviarNotificacao(String tipo, String destinatario, String mensagem) {
        String correlationId = MDC.get("correlationId");
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            if (correlationId != null) {
                headers.set("X-Correlation-ID", correlationId);
            }

            Map<String, String> body = new HashMap<>();
            body.put("tipo", tipo);
            body.put("destinatario", destinatario);
            body.put("mensagem", mensagem);
            body.put("canal", "email"); // FIXME: canal hardcoded

            HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

            String url = NOTIFICACAO_API_URL + "/api/notificacoes";
            log.info("Chamando api-notificacoes: url={}, tipo={}, destinatario={}", url, tipo, destinatario);

            var response = restTemplate.postForEntity(url, request, String.class);

            log.info("Resposta api-notificacoes: statusCode={}, tipo={}", response.getStatusCode().value(), tipo);
            return "ENVIADO";
        } catch (Exception e) {
            log.error("Falha ao chamar api-notificacoes: tipo={}, erro={}", tipo, e.getMessage());
            return "FALHA";
        }
    }

    /**
     * Envia notificação SMS
     * 
     * FIXME: Código duplicado com enviarNotificacao
     * FIXME: Deveria ser o mesmo método com canal diferente
     */
    public void enviarSms(String destinatario, String mensagem) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, String> body = new HashMap<>();
            body.put("tipo", "SMS");
            body.put("destinatario", destinatario);
            body.put("mensagem", mensagem);
            body.put("canal", "sms");

            HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

            String url = NOTIFICACAO_API_URL + "/api/notificacoes";
            restTemplate.postForEntity(url, request, String.class);
        } catch (Exception e) {
            log.error("Erro ao enviar SMS: {}", e.getMessage());
        }
    }
}
