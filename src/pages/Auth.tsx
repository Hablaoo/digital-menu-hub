import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import hablaooLogo from "@/assets/logo-hablaoo.jpg";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerNombre, setRegisterNombre] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantAddress, setRestaurantAddress] = useState("");
  const [restaurantPhone, setRestaurantPhone] = useState("");

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/home");
      }
    };
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && event === "SIGNED_IN") {
        navigate("/home");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) {
        toast({
          title: "Error al iniciar sesión",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Bienvenido",
          description: "Has iniciado sesión correctamente",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            nombre: registerNombre,
            restaurant_name: restaurantName,
            restaurant_address: restaurantAddress,
            restaurant_phone: restaurantPhone,
          }
        }
      });

      if (signUpError) {
        toast({
          title: "Error al registrarse",
          description: signUpError.message,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        toast({
          title: "Registro exitoso",
          description: "Por favor verifica tu correo electrónico",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <img
            src={hablaooLogo}
            alt="Hablaoo"
            className="w-32 h-32 mx-auto mb-4 drop-shadow-lg"
          />
          <h1 className="text-3xl font-bold text-secondary mb-2">Hablaoo</h1>
          <p className="text-muted-foreground">Tu agente inteligente para reservas y pedidos</p>
        </div>

        <Card className="shadow-2xl border-border/50 backdrop-blur animate-in fade-in slide-in-from-bottom-4 duration-700">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Acceso</CardTitle>
            <CardDescription className="text-center">
              Inicia sesión o crea tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register">Registrarse</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Contraseña</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:scale-[1.02] transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? "Cargando..." : "Iniciar Sesión"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-nombre">Nombre</Label>
                    <Input
                      id="register-nombre"
                      type="text"
                      placeholder="Tu nombre"
                      value={registerNombre}
                      onChange={(e) => setRegisterNombre(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Contraseña</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      minLength={6}
                    />
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <h3 className="text-lg font-medium mb-4">Datos del Restaurante</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="restaurant-name">Nombre del Restaurante</Label>
                        <Input
                          id="restaurant-name"
                          type="text"
                          placeholder="Nombre de tu negocio"
                          value={restaurantName}
                          onChange={(e) => setRestaurantName(e.target.value)}
                          required
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="restaurant-address">Dirección</Label>
                        <Input
                          id="restaurant-address"
                          type="text"
                          placeholder="Dirección completa"
                          value={restaurantAddress}
                          onChange={(e) => setRestaurantAddress(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="restaurant-phone">Teléfono del Restaurante</Label>
                        <Input
                          id="restaurant-phone"
                          type="tel"
                          placeholder="Teléfono de contacto"
                          value={restaurantPhone}
                          onChange={(e) => setRestaurantPhone(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-secondary to-accent hover:shadow-lg hover:scale-[1.02] transition-all mt-6"
                    disabled={isLoading}
                  >
                    {isLoading ? "Cargando..." : "Crear Cuenta"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
