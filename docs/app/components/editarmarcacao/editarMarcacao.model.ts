import { DatePipe } from '@angular/common';

export interface RegistroPonto {
    idRegistroPonto?: number;
    idUsuario: number;
    dataRegistro: DatePipe;
    horaRegistro: DatePipe;
    justificaPonto: number;
    justificativaReprovacao: string;
}