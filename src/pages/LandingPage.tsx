import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Plane, Hotel, Car, Bus, CheckCircle, Zap, Shield, BarChart3,
  ArrowRight, Globe, Clock, Users, CreditCard, ChevronRight
} from "lucide-react";

const LandingPage = () => {
  const { user, loading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/reservas");
    }
  }, [user, loading, navigate]);

  const handleExperimentar = () => {
    if (user) {
      navigate("/reservas");
    } else {
      signInWithGoogle();
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-7 h-7 text-[#00a0e4]" />
            <span className="text-xl font-bold tracking-tight">
              <span className="text-[#0b2a45]">on</span>
              <span className="text-[#00a0e4]">fly</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-[#0b2a45] transition-colors">Produto</a>
            <a href="#benefits" className="hover:text-[#0b2a45] transition-colors">Benefícios</a>
            <a href="#how" className="hover:text-[#0b2a45] transition-colors">Como funciona</a>
            <a href="#cta" className="hover:text-[#0b2a45] transition-colors">Planos</a>
          </div>
          <Button
            onClick={handleExperimentar}
            className="bg-[#00a0e4] hover:bg-[#0090d0] text-white font-semibold px-6 rounded-full shadow-lg shadow-[#00a0e4]/20"
          >
            Quero experimentar
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f0f9ff] via-white to-[#f0f4ff]" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-[#00a0e4]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#0b2a45]/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#00a0e4]/10 text-[#00a0e4] text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <Zap className="w-4 h-4" />
              + de 3.2 mil empresas já simplificam com a Onfly
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-[#0b2a45] mb-6">
              Viagem a trabalho{" "}
              <span className="text-[#00a0e4]">não precisa dar trabalho</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-xl mb-10 leading-relaxed">
              Chega de perrengue para organizar viagens e despesas corporativas. Economize até 40% com gestão em tempo real.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleExperimentar}
                size="lg"
                className="bg-[#00a0e4] hover:bg-[#0090d0] text-white text-lg px-10 py-6 rounded-full shadow-xl shadow-[#00a0e4]/25 font-semibold"
              >
                Quero experimentar
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-gray-300 text-gray-700 text-lg px-10 py-6 rounded-full hover:bg-gray-50 font-medium"
              >
                Agendar demonstração
              </Button>
            </div>
          </div>

          {/* Floating cards */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Plane, label: "Passagens aéreas", desc: "Melhores tarifas" },
              { icon: Hotel, label: "Hotéis", desc: "200mil+ opções" },
              { icon: Car, label: "Aluguel de carros", desc: "Frotas nacionais" },
              { icon: Bus, label: "Rodoviário", desc: "Todo o Brasil" },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-2xl p-5 shadow-lg shadow-gray-100/80 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-[#00a0e4]/10 flex items-center justify-center mb-3">
                  <item.icon className="w-5 h-5 text-[#00a0e4]" />
                </div>
                <p className="font-semibold text-[#0b2a45] text-sm">{item.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[#00a0e4] uppercase tracking-widest mb-3">Produto</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#0b2a45] mb-4">
              Tudo em uma só plataforma
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Do planejamento ao relatório, gerencie viagens corporativas com autonomia, controle e economia.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Reservas em minutos",
                desc: "Reserve passagens, hotéis e carros em até 3 minutos com total autonomia. Tudo integrado em um só lugar.",
              },
              {
                icon: Shield,
                title: "Aprovações inteligentes",
                desc: "Políticas de viagem automatizadas. Aprovações automáticas para viagens dentro da política, fluxo gerencial para exceções.",
              },
              {
                icon: BarChart3,
                title: "Relatórios em tempo real",
                desc: "Dashboards completos com visão por centro de custo, status de aprovação e economia gerada por período.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00a0e4]/10 to-[#00a0e4]/5 flex items-center justify-center mb-5">
                  <item.icon className="w-7 h-7 text-[#00a0e4]" />
                </div>
                <h3 className="text-xl font-bold text-[#0b2a45] mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-semibold text-[#00a0e4] uppercase tracking-widest mb-3">Benefícios</p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#0b2a45] mb-6 leading-tight">
                Economize até <span className="text-[#00a0e4]">40%</span> nas viagens corporativas
              </h2>
              <p className="text-lg text-gray-500 mb-10 leading-relaxed">
                Mais de 3.200 empresas já usam a Onfly para simplificar a gestão de viagens e despesas.
              </p>
              <div className="space-y-5">
                {[
                  { icon: Clock, text: "Reduza o tempo de reserva de horas para minutos" },
                  { icon: CreditCard, text: "Cartão corporativo integrado, fim de reembolsos" },
                  { icon: Users, text: "Gestão centralizada para toda a equipe" },
                  { icon: CheckCircle, text: "Integração com ERPs e sistemas de pagamento" },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#00a0e4]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.icon className="w-5 h-5 text-[#00a0e4]" />
                    </div>
                    <p className="text-gray-700 font-medium">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {[
                { value: "40%", label: "de economia média" },
                { value: "3min", label: "para fazer uma reserva" },
                { value: "3.2k+", label: "empresas ativas" },
                { value: "24/7", label: "suporte especializado" },
              ].map((stat) => (
                <div key={stat.label} className="bg-gradient-to-br from-[#0b2a45] to-[#163a5c] rounded-3xl p-7 text-center">
                  <p className="text-4xl font-extrabold text-[#00a0e4] mb-2">{stat.value}</p>
                  <p className="text-sm text-gray-300 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 px-6 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[#00a0e4] uppercase tracking-widest mb-3">Como funciona</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#0b2a45] mb-4">
              Simples assim
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Solicite", desc: "O colaborador faz a reserva direto na plataforma" },
              { step: "02", title: "Aprove", desc: "O gestor recebe e aprova em segundos — ou a política aprova automaticamente" },
              { step: "03", title: "Viaje", desc: "Tudo confirmado: bilhetes, hotel e transporte prontos" },
              { step: "04", title: "Analise", desc: "Relatórios completos de custo, economia e conformidade" },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-6xl font-black text-[#00a0e4]/10 mb-2">{item.step}</div>
                <h3 className="text-lg font-bold text-[#0b2a45] mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-[#0b2a45] to-[#163a5c] rounded-[2rem] p-12 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00a0e4]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#00a0e4]/5 rounded-full blur-2xl" />
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                Pronto para simplificar suas viagens?
              </h2>
              <p className="text-lg text-gray-300 mb-10 max-w-xl mx-auto">
                Experimente gratuitamente e veja como é fácil gerenciar viagens corporativas com a Onfly.
              </p>
              <Button
                onClick={handleExperimentar}
                size="lg"
                className="bg-[#00a0e4] hover:bg-[#0090d0] text-white text-lg px-12 py-6 rounded-full shadow-xl shadow-[#00a0e4]/30 font-semibold"
              >
                Quero experimentar agora
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#00a0e4]" />
            <span className="font-bold text-[#0b2a45]">on<span className="text-[#00a0e4]">fly</span></span>
          </div>
          <p className="text-sm text-gray-400">
            © 2026 Onfly. Todos os direitos reservados. Viagens corporativas simplificadas.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
