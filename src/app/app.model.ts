import { DatePipe } from '@angular/common';

export interface Usuario {
    idUsuario?: string;
    cargo: Cargo;
    jornada: Jornada;
    setor: Setor;
    nomeUsuario: string;
    cpf: string;
    rg: string;
    dataNascimento: Date;
    telefone: string;
    ativo: boolean;
    gestor: boolean;
    login: string;
    senha: string;
    foto: string;
    cargoConfianca: boolean;
}

export interface RegistroPonto {
    idRegistroPonto?: number;
    idUsuario: Usuario;
    dataRegistro: DatePipe;
    horaRegistro: DatePipe;
    justificaPonto: number;
    justificativaReprovacao: string;
}

export interface Setor {
    idSetor?: number;
    idUsuario: Usuario;
    descricaoSetor: string;
}

export interface Cargo {
    idCargo?: number;
    nomeCargo: string;
}

export interface Jornada {
    idJornada?: number;
    inicioManha: any;
    finalManha: any;
    inicioTarde: any;
    finalTarde: any;
}

export interface EspelhoPonto {
    idEspelhoPonto?: number;
    idUsuario: number;
    dataInicial: any;
    dataFinal: any;
    status: number;
}

export interface Endereco {
    idEndereco?: number;
    idUsuario: number;
    idEmpresa: number;
    cep: string;
    rua: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
}