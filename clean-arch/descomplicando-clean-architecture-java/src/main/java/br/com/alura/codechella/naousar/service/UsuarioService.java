package br.com.alura.codechella.naousar.service;

import java.util.List;

import br.com.alura.codechella.infra.persistence.UsuarioEntity;

public interface UsuarioService {
    UsuarioEntity cadastrarUsuario(UsuarioEntity usuario);

    List<UsuarioEntity> listarTodos();
}
