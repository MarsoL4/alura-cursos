package br.com.alura.codechella;

import br.com.alura.codechella.domain.entities.usuario.Usuario;
import br.com.alura.codechella.infra.gateways.RepositorioDeUsuarioEmArquivo;

import java.time.LocalDate;

public class UtilizaUsuarioComArquivos {
    public static void main(String[] args) {
        RepositorioDeUsuarioEmArquivo repositorioDeUsuarioEmArquivo = new RepositorioDeUsuarioEmArquivo();

        repositorioDeUsuarioEmArquivo.cadastrarUsuario(new Usuario("456.789.888-88", "João", LocalDate.parse("2000-10-15"), "joao@email.com"));
        repositorioDeUsuarioEmArquivo.cadastrarUsuario(new Usuario("456.789.888-88", "Maria", LocalDate.parse("2000-10-15"), "maria@email.com"));
        repositorioDeUsuarioEmArquivo.cadastrarUsuario(new Usuario("456.789.888-88", "Vinicios", LocalDate.parse("2000-10-15"), "vinicios@email.com"));
        repositorioDeUsuarioEmArquivo.cadastrarUsuario(new Usuario("456.789.888-88", "Raphael", LocalDate.parse("2000-10-15"), "raphael@email.com"));

        //System.out.println(repositorioDeUsuarioEmArquivo.listarTodos());
        repositorioDeUsuarioEmArquivo.gravaEmArquivo("usuarios.txt");
    }
}