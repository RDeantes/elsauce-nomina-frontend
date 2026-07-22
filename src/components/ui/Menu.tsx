"use client";

import Link from "next/link";

export default function Menu() {

    return (

        <div
            style={{
                background: "black",
                color: "white",
                padding: "20px",
                display: "flex",
                gap: "20px"
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

            <Link href="/descansos">
             Descansos
            </Link>

        </div>

    );

}