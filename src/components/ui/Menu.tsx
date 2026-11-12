"use client";

import Link from "next/link";

export default function Menu() {

    return (

        <div
            style={{
                background: "black",
                color: "white",
                padding: "16px 20px",
                display: "flex",
                flexWrap: "wrap",
                gap: "12px 20px"
            }}
        >

            <Link href="/empleados">
                Empleados
            </Link>

            <Link href="/asistencias">
                Asistencias
            </Link>

            <Link href="/nominas">
                Nómina
            </Link>

            <Link href="/historial">
                Historial
            </Link>

            <Link href="/descansos">
                Descansos
            </Link>

        </div>

    );

}
