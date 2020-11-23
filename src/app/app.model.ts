import { DatePipe } from '@angular/common';

export interface Usuario {
    idUsuario?: string;
    cargo: Cargo;
    jornada: Jornada;
    setor: Setor;
    nomeUsuario: string;
    cpf: string;
    rg: string;
    dataNascimento: DatePipe;
    telefone: string;
    ativo: boolean;
    gestor: any;
    login: string;
    senha: string;
    foto: string;
    cargoConfianca: boolean;
    cep: string;
    rua: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
}

export interface RegistroPonto {
    idRegistroPonto?: number;
    idUsuario: Usuario;
    dataRegistro: DatePipe;
    horaRegistro: DatePipe;
    justificaPonto: number;
    justificativaReprovacao: string;
    edicaoAprovada: number;
}

export interface Setor {
    idSetor?: number;
    idUsuario: Usuario;
    descricaoSetor: string;
    nomeResponsavel: string;
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
