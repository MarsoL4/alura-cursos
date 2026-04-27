package com.rotalog.repository;

import com.rotalog.domain.AlertaManutencao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertaManutencaoRepository extends JpaRepository<AlertaManutencao, Long> {

	List<AlertaManutencao> findByStatusNotificacao(String statusNotificacao);

	List<AlertaManutencao> findByVeiculoId(Long veiculoId);

	boolean existsByVeiculoIdAndStatusNotificacao(Long veiculoId, String statusNotificacao);
}
