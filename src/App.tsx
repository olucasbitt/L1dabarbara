import { useEffect, useState } from "react";

type Numero = {
  numero: string;
  nome: string;
};

const API_URL = "COLE_SUA_URL_AQUI";
const VALOR = 15;

export default function App() {
  const [numeros, setNumeros] = useState<Numero[]>([]);

  useEffect(() => {
    const lista: Numero[] = [];
    for (let i = 0; i < 100; i++) {
      lista.push({
        numero: i.toString().padStart(2, "0"),
        nome: ""
      });
    }
    setNumeros(lista);
  }, []);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    const res = await fetch(API_URL);
    const data = await res.json();

    setNumeros(prev => {
      const atualizados = [...prev];

      data.slice(1).forEach((row: any) => {
        const [numero, nome] = row;

        const index = atualizados.findIndex(n => n.numero === numero);
        if (index !== -1) {
          atualizados[index].nome = nome;
        }
      });

      return atualizados;
    });
  }

  async function registrar(numero: string, nome: string) {
    if (!nome) return;

    const data = new Date().toLocaleDateString("pt-BR");

    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        numero,
        nome,
        valor: VALOR,
        data
      })
    });
  }

  function atualizarNome(numero: string, nome: string) {
    setNumeros(prev =>
      prev.map(n =>
        n.numero === numero ? { ...n, nome } : n
      )
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-5xl mx-auto">

        {/* HEADER SIMPLES */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">
            🎯 Sorteio Solidário
          </h1>
          <p className="text-gray-600">
            Ajude a Bárbara no CrossFit L1
          </p>
          <p className="text-sm text-gray-500">
            R$15 por número
          </p>
        </div>

        {/* GRID 4 COLUNAS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {[0, 1, 2, 3].map(col => (
            <div key={col} className="bg-white rounded-xl p-4 shadow">

              {numeros
                .slice(col * 25, col * 25 + 25)
                .map(n => (
                  <div
                    key={n.numero}
                    className="flex items-center justify-between border-b py-1 text-sm"
                  >
                    <span className="font-semibold w-10">
                      {n.numero} -
                    </span>

                    <input
                      value={n.nome}
                      onChange={(e) =>
                        atualizarNome(n.numero, e.target.value)
                      }
                      onBlur={(e) =>
                        registrar(n.numero, e.target.value)
                      }
                      placeholder=""
                      className={`
                        flex-1 ml-2 outline-none bg-transparent
                        ${n.nome ? "text-green-600 font-medium" : ""}
                      `}
                    />
                  </div>
                ))}

            </div>
          ))}

        </div>
      </div>
    </div>
  );
}