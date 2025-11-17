import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ChefHat, ClipboardList, UtensilsCrossed, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import hablaooLogo from "@/assets/hablaoo-logo.png";

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      // Get user profile
      const { data: profile } = await supabase
        .from("perfiles")
        .select("nombre")
        .eq("id", session.user.id)
        .single();

      if (profile?.nombre) {
        setUserName(profile.nombre);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
    navigate("/auth");
  };

  const menuOptions = [
    {
      title: "Carta Digital",
      description: "Gestiona tu menú digital",
      icon: UtensilsCrossed,
      gradient: "from-primary to-accent",
      action: () => toast({ title: "Próximamente", description: "Función en desarrollo" }),
    },
    {
      title: "Calendario",
      description: "Administra tus horarios",
      icon: Calendar,
      gradient: "from-secondary to-primary",
      action: () => toast({ title: "Próximamente", description: "Función en desarrollo" }),
    },
    {
      title: "Reservas",
      description: "Gestiona las reservas",
      icon: ClipboardList,
      gradient: "from-accent to-primary",
      action: () => toast({ title: "Próximamente", description: "Función en desarrollo" }),
    },
    {
      title: "Ingeniería de Menú",
      description: "Optimiza tu carta",
      icon: ChefHat,
      gradient: "from-secondary to-accent",
      action: () => toast({ title: "Próximamente", description: "Función en desarrollo" }),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-card/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={hablaooLogo} alt="Hablaoo" className="w-12 h-12" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Hablaoo
              </h1>
              <p className="text-sm text-muted-foreground">Panel de Control</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {userName && (
              <span className="text-sm font-medium text-foreground">
                Hola, {userName}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
            <h2 className="text-4xl font-bold text-secondary mb-4">
              Bienvenido a tu Panel
            </h2>
            <p className="text-lg text-muted-foreground">
              Selecciona una opción para comenzar a gestionar tu restaurante
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {menuOptions.map((option, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer border-border/50 backdrop-blur overflow-hidden"
                onClick={option.action}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <CardHeader className="relative">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${option.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <option.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                    {option.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {option.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-primary hover:bg-primary/10 group-hover:translate-x-2 transition-transform"
                  >
                    Acceder →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
