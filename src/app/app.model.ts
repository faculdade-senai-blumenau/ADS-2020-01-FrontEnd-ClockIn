import { DatePipe } from '@angular/common';

export interface Usuario {
    idUsuario?: string;
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
    idCargo: number;
    cargo: Cargo;
    jornada: Jornada;
}

export interface RegistroPonto {
    idRegistroPonto?: number;
    idUsuario: number;
    dataRegistro: DatePipe;
    horaRegistro: DatePipe;
    justificaPonto: number;
    justificativaReprovacao: string;
}

export interface Setor {
    idSetor?: number;
    idUsuario: number;
    descricaoSetor: string;
    usuario: Usuario;
    cargo: Cargo;
    jornada: Jornada;
}

export interface Cargo {
    idCargo?: number;
    nomeCargo: string;
}

export interface Jornada {
    idJornada?: number;
    inicioManha: string;
    finalManha: string;
    inicioTarde: string;
    finalTarde: string;
}

export interface EspelhoPonto {
    idEspelhoPonto?: number;
    idUsuario: number;
    dataInicial: any;
    dataFinal: any;
    status: number;
}