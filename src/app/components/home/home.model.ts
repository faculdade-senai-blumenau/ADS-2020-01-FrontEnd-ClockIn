export interface Usuario {
    idUsuario: String
    nomeUsuario: String
    cpf: String
    rg: String
    dataNascimento: Date
    telefone: String
    ativo: Boolean
    gestor: Boolean
    login: String
    senha: String
    foto: String
    cargoConfianca: Boolean
}

export interface registroPonto {
    idUsuario: Number;
    dataRegistro: Date
    JustificapPonto: Number;
    JustificativapReprovacao: String
}