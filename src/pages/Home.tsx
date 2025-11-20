import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ChefHat, ClipboardList, UtensilsCrossed, LogOut, LayoutDashboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import hablaooLogo from "@/assets/logo-hablaoo.jpg";

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userName, setUserName] = useState<string>("");
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const [reservations, setReservations] = useState<any[]>([]);

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

      // Get restaurant ID for the user
      const { data: restaurant } = await supabase
        .from("restaurantes")
        .select("restaurante_id")
        .eq("usuario_id", session.user.id)
        .single();

      if (restaurant) {
        // Get reservations
        const { data: reservasData } = await supabase
          .from("reservas")
          .select(`
            *,
            clientes (nombre, telefono)
          `)
          .eq("restaurante_id", restaurant.restaurante_id)
          .order("fecha_hora", { ascending: true })
          .limit(5);

        if (reservasData) {
          setReservations(reservasData);
        }
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
      id: "dashboard",
      title: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "carta",
      title: "Carta Digital",
      icon: UtensilsCrossed,
    },
    {
      id: "calendario",
      title: "Calendario",
      icon: Calendar,
    },
    {
      id: "reservas",
      title: "Reservas",
      icon: ClipboardList,
    },
    {
      id: "ingenieria",
      title: "Ingeniería de Menú",
      icon: ChefHat,
    },
  ];

  const handleNavigation = (section: string) => {
    if (section === "carta") {
      navigate("/carta-digital");
    } else if (section === "dashboard") {
      setActiveSection("dashboard");
    } else {
      setActiveSection(section);
      toast({ title: "Próximamente", description: "Función en desarrollo" });
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border fixed left-0 top-0 h-full flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <img src={hablaooLogo} alt="Hablaoo" className="w-12 h-12 rounded-lg" />
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Hablaoo
              </h1>
              <p className="text-xs text-muted-foreground">Panel de Control</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleNavigation(option.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeSection === option.id
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "hover:bg-muted text-foreground"
              }`}
            >
              <option.icon className="w-5 h-5" />
              <span className="font-medium">{option.title}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          {userName && (
            <p className="text-sm text-muted-foreground mb-3 px-2">
              Hola, <span className="font-semibold text-foreground">{userName}</span>
            </p>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
            <p className="text-muted-foreground">Bienvenido a tu panel de control</p>
          </div>

          {/* Dashboard Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {menuOptions.slice(1).map((option, index) => (
              <Card
                key={option.id}
                className="group hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer border-border/50"
                onClick={() => handleNavigation(option.id)}
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <option.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {option.title}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Reservations Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Próximas Reservas</CardTitle>
              <CardDescription>Últimas reservas programadas</CardDescription>
            </CardHeader>
            <CardContent>
              {reservations.length > 0 ? (
                <div className="space-y-4">
                  {reservations.map((reserva) => (
                    <div
                      key={reserva.reserva_id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {reserva.clientes?.nombre || "Cliente"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {reserva.clientes?.telefono || "Sin teléfono"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">
                          {new Date(reserva.fecha_hora).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(reserva.fecha_hora).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="ml-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            reserva.estado === "Confirmada"
                              ? "bg-green-500/10 text-green-500"
                              : reserva.estado === "Pendiente"
                              ? "bg-yellow-500/10 text-yellow-500"
                              : "bg-gray-500/10 text-gray-500"
                          }`}
                        >
                          {reserva.estado}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No hay reservas programadas</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Home;
