package br.com.alura.codechella.infra.gateways;

import br.com.alura.codechella.application.gateways.RepositorioDeUsuario;
import br.com.alura.codechella.infra.persistence.UsuarioRepository;
import br.com.alura.codechella.domain.entities.usuario.Usuario;

import java.util.List;

public class RepositorioDeUsuarioJpa implements RepositorioDeUsuario {
    private final UsuarioRepository repositorio;

    public RepositorioDeUsuarioJpa(UsuarioRepository repositorio) {
        this.repositorio = repositorio;
    }

    @Override
    public Usuario cadastrarUsuario(Usuario usuario) {
        return repositorio.save(usuario);
    }

    @Override
    public List<Usuario> listarTodos() {
        return repositorio.findAll();
    }


}
