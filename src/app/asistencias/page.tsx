"use client";

import { useEffect, useState } from "react";

import { api } from "@/services/api";

import { Input } from "@/components/ui/input";

export default function AsistenciasPage() {

  // =========================================
  // ESTADOS
  // =========================================

  const [fecha, setFecha] = useState("");

  const [asistencias, setAsistencias] = useState([]);

  // =========================================
  // FECHA AUTOMATICA
  // =========================================

  useEffect(() => {

    const hoy = new Date()
      .toISOString()
      .split("T")[0];

    setFecha(hoy);

  }, []);

  // =========================================
  // OBTENER ASISTENCIAS
  // =========================================

  async function obtenerAsistencias() {

    try {

      const response =
        await api.get(
          `/asistencias?fecha=${fecha}`
        );

      setAsistencias(response.data);

    } catch (error) {

      console.log(error);

    }

  }

  // =========================================
  // RECARGAR AL CAMBIAR FECHA
  // =========================================

  useEffect(() => {

    if (fecha) {

      obtenerAsistencias();

    }

  }, [fecha]);


  async function justificarFalta(
  id_empleado: number,
  fecha: string
) {

  try {

    await api.put(
      "/asistencias/justificar",
      {
        id_empleado,
        fecha
      }
    );

    alert("Falta justificada");

    obtenerAsistencias();

  } catch (error) {

    console.log(error);

    alert("Error justificando falta");

  }

}
  // =========================================
  // RENDER
  // =========================================

  return (

    <main className="min-h-screen bg-[#F5F6F8] p-6">

      <div className="max-w-[1600px] mx-auto">

        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <div className="mb-6">

          <h1 className="text-4xl font-bold text-[#111827]">
            Asistencias
          </h1>

          <p className="text-[#6B7280] mt-2">
            Control de asistencias del personal
          </p>

        </div>

        {/* ========================================= */}
        {/* FILTRO */}
        {/* ========================================= */}

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 mb-6">

          <div className="max-w-sm">

            <label className="block text-sm font-medium mb-2">
              Fecha
            </label>

            <Input
              type="date"
              value={fecha}
              onChange={(e) =>
                setFecha(e.target.value)
              }
              className="h-12 rounded-xl"
            />

          </div>

        </div>

        {/* ========================================= */}
        {/* TABLA */}
        {/* ========================================= */}

        <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">

          <table className="w-full">

            {/* ========================================= */}
            {/* HEADER TABLA */}
            {/* ========================================= */}

            <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">

              <tr>

                <th className="text-left px-6 py-4 text-sm font-semibold">
                  Empleado
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold">
                  Estatus
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold">
                  Entrada
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold">
                  Salida
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold">
                  Horas
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold">
                  Retardo
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold">
                  Descuento
                </th>
<th className="text-left px-6 py-4 text-sm font-semibold">
  Acción
</th>

              </tr>

            </thead>

            {/* ========================================= */}
            {/* BODY */}
            {/* ========================================= */}

            <tbody>

              {asistencias.map((asistencia: any) => (

                <tr
                  key={asistencia.id_asistencia}
                  className="border-b border-[#F3F4F6]"
                >

                  {/* EMPLEADO */}
                  <td className="px-6 py-4 text-sm font-medium">

                    {asistencia.empleados?.nombre}{" "}
                    {asistencia.empleados?.apellido_paterno}

                  </td>

                  {/* ESTATUS */}
                  <td className="px-6 py-4">

                    {asistencia.estatus === "PRESENTE" && (
                      <span className="bg-[#DCFCE7] text-[#15803D] text-xs px-3 py-1 rounded-full">
                        PRESENTE
                      </span>
                    )}

                    {asistencia.estatus === "FALTA" && (
                      <span className="bg-[#FEE2E2] text-[#DC2626] text-xs px-3 py-1 rounded-full">
                        FALTA
                      </span>
                    )}

                    {asistencia.estatus === "DESCANSO" && (
                      <span className="bg-[#DBEAFE] text-[#2563EB] text-xs px-3 py-1 rounded-full">
                        DESCANSO
                      </span>
                    )}

                    {asistencia.estatus === "JUSTIFICADA" && (
                      <span className="bg-[#FEF3C7] text-[#D97706] text-xs px-3 py-1 rounded-full">
                        JUSTIFICADA
                      </span>
                    )}

                  </td>

                  {/* ENTRADA */}
                  <td className="px-6 py-4 text-sm">
                    {asistencia.hora_entrada || "-"}
                  </td>

                  {/* SALIDA */}
                  <td className="px-6 py-4 text-sm">
                    {asistencia.hora_salida || "-"}
                  </td>

                  {/* HORAS */}
                  <td className="px-6 py-4 text-sm">
                    {asistencia.horas_trabajadas || "-"}
                  </td>

                  {/* RETARDO */}
                  <td className="px-6 py-4 text-sm">

                    {asistencia.minutos_retardo > 0 ? (

                      <span className="text-red-600 font-medium">
                        {asistencia.minutos_retardo} min
                      </span>

                    ) : (

                      <span className="text-green-600">
                        Sin retardo
                      </span>

                    )}

                  </td>

                  {/* DESCUENTO */}
                  <td className="px-6 py-4 text-sm font-medium">

                    $
                    {Number(
                      asistencia.descuento_retardo || 0
                    ).toFixed(2)}

                  </td>
                  <td>

    {

        asistencia.estatus === "FALTA"

        ? (

            <button

                onClick={() =>
                    justificarFalta(
                        asistencia.id_empleado,
                        asistencia.fecha
                    )
                }

                className="
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    px-3
                    py-1
                    rounded
                "
            >

                Justificar falta

            </button>

        )

        : "-"

    }

</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </main>

  );

}