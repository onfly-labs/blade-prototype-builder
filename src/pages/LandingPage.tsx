import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Plane, Hotel, Car, Bus, Zap, Shield, BarChart3,
  ArrowRight, Globe, Clock, Users, CheckCircle, ChevronRight,
  Timer, TrendingUp, BellRing, GitBranch
} from "lucide-react";
import reservasScreenshot from "@/assets/reservas-screenshot.png";
import heroBg from "@/assets/hero-bg.jpg";

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
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-7 h-7 text-[#00a0e4]" />
            <span className="text-xl font-bold tracking-tight">
              <span className="text-[#0b2a45]">on</span>
              <span className="text-[#00a0e4]">fly</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
            <a href="#produto" className="hover:text-[#0b2a45] transition-colors">Produto</a>
            <a href="#automacao" className="hover:text-[#0b2a45] transition-colors">Automação</a>
            <a href="#metricas" className="hover:text-[#0b2a45] transition-colors">Resultados</a>
          </div>
          <Button
            onClick={handleExperimentar}
            className="bg-[#00a0e4] hover:bg-[#0090d0] text-white font-semibold px-6 rounded-full shadow-lg shadow-[#00a0e4]/20 text-sm"
          >
            Quero experimentar
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-28 pb-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b2a45]/85 via-[#0b2a45]/70 to-white" />
        {/* Large white airplane SVG */}
        <svg className="absolute right-[-5%] top-[10%] w-[600px] h-[600px] opacity-[0.07]" viewBox="0 0 512 512" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M497.7 75.3L437 14.7C430.7 8.4 422.2 4.8 413.3 4.8s-17.3 3.6-23.7 9.9L295 109.3 53.3 25.7c-7-2.4-14.6-1.1-20.3 3.5L9.4 49.9c-7.2 5.9-9.9 15.5-6.8 24.3l85.7 240.6L30.1 373c-16.3 16.3-16.3 42.7 0 59l50 50c16.3 16.3 42.7 16.3 59 0l58.2-58.2L438 510.6c8.8 3.1 18.4 .4 24.3-6.8l20.7-23.6c4.6-5.7 5.9-13.3 3.5-20.3l-83.6-241.7 94.7-94.7c13.1-13 13.1-34.3.1-47.4v-.4zM147.3 440.1l-7.4 7.4c-2.4 2.4-6.3 2.4-8.7 0l-67.2-67.2c-2.4-2.4-2.4-6.3 0-8.7l7.4-7.4 75.9 75.9z" />
        </svg>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - copy */}
            <div className="py-12 lg:py-20">
              <div className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
                <Zap className="w-3.5 h-3.5" />
                Gestão inteligente de viagens
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.08] tracking-tight text-white mb-5">
                Reservas rápidas.
                <br />
                Aprovações{" "}
                <span className="text-[#00a0e4]">automáticas.</span>
                <br />
                Controle total.
              </h1>
              <p className="text-lg text-white/70 max-w-md mb-8 leading-relaxed">
                Reduza de horas para minutos o ciclo completo de reserva, aprovação e relatório de viagens corporativas.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleExperimentar}
                  size="lg"
                  className="bg-[#00a0e4] hover:bg-[#0090d0] text-white text-base px-8 py-6 rounded-full shadow-xl shadow-[#00a0e4]/25 font-semibold gap-2"
                >
                  Experimentar grátis
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Mini stats */}
              <div className="flex gap-8 mt-10 pt-8 border-t border-white/20">
                {[
                  { value: "3min", label: "tempo médio de reserva" },
                  { value: "85%", label: "aprovações automáticas" },
                  { value: "40%", label: "economia em viagens" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-extrabold text-[#00a0e4]">{s.value}</p>
                    <p className="text-xs text-[#00a0e4] mt-0.5 font-medium">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - screenshot */}
            <div className="relative hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-[#00a0e4]/20 to-[#0b2a45]/10 rounded-3xl blur-2xl" />
                <img
                  src={reservasScreenshot}
                  alt="Painel de reservas da Onfly mostrando viagens com status de aprovação"
                  className="relative rounded-2xl shadow-2xl shadow-[#0b2a45]/15 border border-gray-200/50"
                  width={1280}
                  height={720}
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -left-6 bottom-16 bg-white rounded-2xl shadow-xl shadow-gray-200/60 p-4 flex items-center gap-3 border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0b2a45]">Aprovada automaticamente</p>
                  <p className="text-xs text-gray-400">Dentro da política • 2s atrás</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section id="produto" className="py-24 px-6 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-bold text-[#00a0e4] uppercase tracking-[0.2em] mb-3">Produto</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0b2a45] mb-4">
              Uma plataforma para todo o ciclo de viagem
            </h2>
            <p className="text-gray-500">
              Da solicitação ao relatório final — reservas, aprovações e prestação de contas em um único lugar.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Plane, label: "Aéreo", desc: "Passagens com as melhores tarifas negociadas", color: "from-sky-500 to-blue-600" },
              { icon: Hotel, label: "Hotéis", desc: "200 mil+ opções em todo o Brasil e exterior", color: "from-violet-500 to-purple-600" },
              { icon: Car, label: "Carros", desc: "Locação integrada com frotas nacionais", color: "from-amber-500 to-orange-600" },
              { icon: Bus, label: "Rodoviário", desc: "Cobertura completa de rotas nacionais", color: "from-emerald-500 to-teal-600" },
            ].map((item) => (
              <div key={item.label} className="group bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-lg shadow-gray-200/50`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-[#0b2a45] text-lg mb-1">{item.label}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Automation Section */}
      <section id="automacao" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-bold text-[#00a0e4] uppercase tracking-[0.2em] mb-3">Automação de fluxos</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0b2a45] mb-5 leading-tight">
                Aprovações que funcionam <span className="text-[#00a0e4]">sozinhas</span>
              </h2>
              <p className="text-gray-500 mb-10 leading-relaxed">
                Configure regras de política de viagem e deixe o sistema trabalhar. Reservas dentro da política são aprovadas instantaneamente — sem gargalos, sem atrasos.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: GitBranch,
                    title: "Fluxos condicionais",
                    desc: "Defina regras por valor, tipo de reserva, centro de custo ou nível hierárquico.",
                  },
                  {
                    icon: Zap,
                    title: "Aprovação automática",
                    desc: "Reservas dentro da política são aprovadas em menos de 2 segundos, sem intervenção.",
                  },
                  {
                    icon: BellRing,
                    title: "Alertas inteligentes",
                    desc: "Notificações automáticas para aprovadores quando o prazo está se esgotando.",
                  },
                  {
                    icon: Shield,
                    title: "Compliance garantido",
                    desc: "100% das reservas passam pelo fluxo de aprovação — nada escapa da política.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#00a0e4]/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-[#00a0e4]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0b2a45] mb-0.5">{item.title}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual flow */}
            <div className="bg-gradient-to-br from-[#f0f9ff] to-[#f8fafc] rounded-3xl p-8 border border-gray-100">
              <div className="space-y-4">
                {[
                  { step: "Solicitação", detail: "Colaborador reserva voo GRU → BSB", status: "done", time: "11:00" },
                  { step: "Verificação de política", detail: "Valor R$ 890 dentro do limite de R$ 1.200", status: "done", time: "11:00" },
                  { step: "Aprovação automática", detail: "Reserva aprovada pelo sistema", status: "auto", time: "11:00" },
                  { step: "Emissão", detail: "Bilhete emitido e enviado ao viajante", status: "done", time: "11:01" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                        item.status === "auto" ? "bg-[#00a0e4]" : "bg-[#0b2a45]"
                      }`}>
                        {item.status === "auto" ? <Zap className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </div>
                      {i < 3 && <div className="w-px h-8 bg-gray-200 mt-1" />}
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-[#0b2a45] text-sm">{item.step}</p>
                        <span className="text-xs text-gray-300 font-mono">{item.time}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-5 border-t border-gray-200/60 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Timer className="w-4 h-4 text-[#00a0e4]" />
                  <span className="font-bold text-[#0b2a45]">Tempo total: 1 minuto</span>
                </div>
                <span className="text-xs bg-green-50 text-green-600 font-semibold px-3 py-1 rounded-full">Sem intervenção manual</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section id="metricas" className="py-24 px-6 bg-[#0b2a45]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-bold text-[#00a0e4] uppercase tracking-[0.2em] mb-3">Resultados reais</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Produtividade que aparece nos números
            </h2>
            <p className="text-gray-400">
              Empresas que usam a Onfly transformam a gestão de viagens em vantagem competitiva.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: TrendingUp, value: "40%", label: "redução de custos com viagens", desc: "Comparado à gestão manual" },
              { icon: Timer, value: "95%", label: "mais rápido nas aprovações", desc: "De 48h para minutos" },
              { icon: BarChart3, value: "3.2k+", label: "empresas confiam na Onfly", desc: "De startups a enterprises" },
              { icon: Users, value: "100%", label: "visibilidade dos gastos", desc: "Relatórios em tempo real" },
            ].map((item) => (
              <div key={item.label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <item.icon className="w-6 h-6 text-[#00a0e4] mb-4" />
                <p className="text-4xl font-extrabold text-white mb-1">{item.value}</p>
                <p className="text-sm font-semibold text-gray-300 mb-1">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0b2a45] mb-4">
            Pronto para automatizar suas viagens?
          </h2>
          <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto">
            Comece agora e veja como é fácil ter controle total sobre reservas, aprovações e custos.
          </p>
          <Button
            onClick={handleExperimentar}
            size="lg"
            className="bg-[#00a0e4] hover:bg-[#0090d0] text-white text-lg px-12 py-6 rounded-full shadow-xl shadow-[#00a0e4]/25 font-semibold gap-2"
          >
            Quero experimentar agora
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#00a0e4]" />
            <span className="font-bold text-[#0b2a45]">on<span className="text-[#00a0e4]">fly</span></span>
          </div>
          <p className="text-xs text-gray-400">© 2026 Onfly. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
