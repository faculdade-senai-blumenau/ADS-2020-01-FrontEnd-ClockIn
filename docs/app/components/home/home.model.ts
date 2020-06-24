export interface Usuario {
    idUsuario?: string
    nomeUsuario: string
    cpf: string
    rg: string
    dataNascimento: Date
    telefone: string
    ativo: boolean
    gestor: boolean
    login: string
    senha: string
    foto: string
    cargoConfianca: boolean
    idCargo: number 
    cargo:Object
    jornada:Object
}

export interface RegistroPonto {
    idRegistroPonto?: number
    idUsuario: number
    dataRegistro: Date
    justificaPonto: number
    justificativaReprovacao: string
}