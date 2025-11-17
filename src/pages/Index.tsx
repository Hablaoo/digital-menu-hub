import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import hablaooLogo from "@/assets/hablaoo-logo.png";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background">
      <div className="text-center px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <img 
          src={hablaooLogo} 
          alt="Hablaoo" 
          className="w-48 h-48 mx-auto mb-8 drop-shadow-2xl animate-in zoom-in duration-700"
        />
        <h1 className="text-5xl md:text-6xl font-bold text-secondary mb-4">
          Hablaoo
        </h1>
        <p className="text-2xl md:text-3xl font-semibold mb-6">
          Tu agente inteligente para{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            reservas y pedidos
          </span>
        </p>
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          Automatiza tu negocio de hostelería. Tu agente gestiona llamadas, reservas y
          pedidos 24/7.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-accent hover:shadow-2xl hover:scale-105 transition-all text-lg px-8 py-6"
            onClick={() => navigate("/auth")}
          >
            Configurar Mi Agente IA
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground hover:scale-105 transition-all text-lg px-8 py-6"
            onClick={() => navigate("/auth")}
          >
            Acceso Clientes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
