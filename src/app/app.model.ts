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
    idUsuario: Usuario;
    dataRegistro: DatePipe;
    horaRegistro: DatePipe;
    justificaPonto: number;
    justificativaReprovacao: string;
}

export interface Setor {
    //modificado o idSetor por conta do MOK. ao apontar a API, utilizar o idSetor
    id?: number;
    descricaoSetor: string;
}

export interface Cargo {
    idCargo?: number;
    nomeCargo: string;
}

export interface Jornada {
    //modificado o idJornada por conta do MOK. ao apontar a API, utilizar o idJornada
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