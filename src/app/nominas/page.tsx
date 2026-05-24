"use client";

import { useEffect, useState } from "react";

import { api } from "@/services/api";

import { Button } from "@/components/ui/button";

export default function NominasPage() {

  // =========================================
  // ESTADOS
  // =========================================

 const [nominas, setNominas] = useState<any[]>([]);

  // =========================================
  // OBTENER NOMINAS ACUMULADAS
  // =========================================

  async function obtenerNominas() {

    try {

      // =====================================
      // TRAER EMPLEADOS
      // =====================================

      const empleadosResponse =
        await api.get("/empleados");

      const empleados =
        empleadosResponse.data;

      // =====================================
      // CONSULTAR ACUMULADOS
      // =====================================

      const resultados =
        await Promise.all(

          empleados.map(async (emp: any) => {

            try {

              const acumuladoResponse =
                await api.get(
                  `/nominas/acumulado/${emp.id_empleado}`
                );

              return {

                empleado: emp,

                acumulado:
                  acumuladoResponse.data,

              };

            } catch {

              return null;

            }

          })

        );

      // =====================================
      // FILTRAR SOLO LOS QUE TIENEN DINERO
      // =====================================

      const pendientes =
        resultados.filter(

          (r: any) =>

            r &&
            Number(
              r.acumulado.total_acumulado
            ) > 0

        );

      setNominas(pendientes);

    } catch (error) {

      console.log(error);

    }

  }

  // =========================================
  // CARGAR AL INICIAR
  // =========================================

  useEffect(() => {

    obtenerNominas();

  }, []);

  // =========================================
  // PAGAR NOMINA
  // =========================================

  async function pagarNomina(
    id_empleado: number
  ) {

    try {

      const response =
        await api.post(
          `/nominas/imprimir-y-pagar/${id_empleado}`
        );

      alert(
        response.data.mensaje
      );

      // =====================================
      // RECARGAR TABLA
      // =====================================

      obtenerNominas();

    } catch (error) {

      console.log(error);

      alert("Error pagando nómina");

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
            Nóminas Pendientes
          </h1>

          <p className="text-[#6B7280] mt-2">
            Empleados listos para pago
          </p>

        </div>

        {/* ========================================= */}
        {/* TABLA */}
        {/* ========================================= */}

        <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">

          <table className="w-full">

            {/* ========================================= */}
            {/* HEADER */}
            {/* ========================================= */}

            <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">

              <tr>

                <th className="text-left px-6 py-4 text-sm font-semibold">
                  Empleado
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold">
                  Recibos Pendientes
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold">
                  Total Acumulado
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

              {nominas.map((item: any) => (

                <tr
                  key={item.empleado.id_empleado}
                  className="border-b border-[#F3F4F6]"
                >

                  {/* EMPLEADO */}
                  <td className="px-6 py-4 text-sm font-medium">

                    {item.empleado.nombre}{" "}
                    {item.empleado.apellido_paterno}

                  </td>

                  {/* RECIBOS */}
                  <td className="px-6 py-4 text-sm">

                    {
                      item.acumulado
                        .recibos_pendientes
                    }

                  </td>

                  {/* TOTAL */}
                  <td className="
                    px-6
                    py-4
                    text-lg
                    font-bold
                    text-green-600
                  ">

                    $
                    {
                      item.acumulado
                        .total_acumulado
                    }

                  </td>

                  {/* ACCION */}
                  <td className="px-6 py-4">

                    <Button
  onClick={() =>
    pagarNomina(
      item.empleado.id_empleado
    )
  }
  style={{
    backgroundColor: "#2563EB",
    color: "white",
    padding: "10px 18px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
  }}
>
  Realizar Pago de Nómina
</Button>

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