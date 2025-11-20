import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Pencil, Trash2, UtensilsCrossed, Upload, X } from "lucide-react";

interface Category {
  categoria_id: number;
  nombre: string;
  orden: number | null;
}

interface DishImage {
  id: number;
  imagen_url: string;
}

interface Dish {
  plato_id: number;
  nombre: string;
  descripcion: string | null;
  precio_venta: number;
  costo_produccion: number;
  activo: boolean | null;
  categoria_id: number;
  imagen?: string;
}

const CartaDigital = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [restaurantId, setRestaurantId] = useState<number | null>(null);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingDishes, setIsLoadingDishes] = useState(true);

  // Category form state
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Dish form state
  const [dishDialogOpen, setDishDialogOpen] = useState(false);
  const [dishForm, setDishForm] = useState({
    nombre: "",
    descripcion: "",
    precio_venta: "",
    costo_produccion: "",
    categoria_id: "",
  });
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [dishImages, setDishImages] = useState<Record<number, string>>({});

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      // Get restaurant ID
      const { data: restaurant } = await supabase
        .from("restaurantes")
        .select("restaurante_id")
        .eq("usuario_id", session.user.id)
        .single();

      if (restaurant) {
        setRestaurantId(restaurant.restaurante_id);
        await loadCategories(restaurant.restaurante_id);
        await loadDishes();
      } else {
        setIsLoadingCategories(false);
        setIsLoadingDishes(false);
      }
    };

    checkAuthAndLoadData();
  }, [navigate]);

  const loadCategories = async (restId: number) => {
    setIsLoadingCategories(true);
    const { data, error } = await supabase
      .from("categoriasmenu")
      .select("*")
      .eq("restaurante_id", restId)
      .order("orden", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las categorías",
        variant: "destructive",
      });
    } else {
      setCategories(data || []);
    }
    setIsLoadingCategories(false);
  };

  const loadDishes = async () => {
    setIsLoadingDishes(true);
    const { data, error } = await supabase
      .from("platos")
      .select("*")
      .order("nombre", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los platos",
        variant: "destructive",
      });
    } else {
      setDishes(data || []);
      // Cargar imágenes de los platos
      if (data && data.length > 0) {
        const platoIds = data.map(d => d.plato_id);
        const { data: images } = await supabase
          .from("platos_imagenes")
          .select("*")
          .in("plato_id", platoIds);
        
        if (images) {
          const imageMap: Record<number, string> = {};
          images.forEach(img => {
            if (img.plato_id) {
              imageMap[img.plato_id] = img.imagen_url;
            }
          });
          setDishImages(imageMap);
        }
      }
    }
    setIsLoadingDishes(false);
  };

  const handleSaveCategory = async () => {
    if (!categoryName.trim() || !restaurantId) return;

    if (editingCategory) {
      const { error } = await supabase
        .from("categoriasmenu")
        .update({ nombre: categoryName })
        .eq("categoria_id", editingCategory.categoria_id);

      if (error) {
        toast({
          title: "Error",
          description: "No se pudo actualizar la categoría",
          variant: "destructive",
        });
      } else {
        toast({ title: "Éxito", description: "Categoría actualizada correctamente" });
        loadCategories(restaurantId);
      }
    } else {
      const { error } = await supabase
        .from("categoriasmenu")
        .insert({
          nombre: categoryName,
          restaurante_id: restaurantId,
          orden: categories.length,
        });

      if (error) {
        toast({
          title: "Error",
          description: "No se pudo crear la categoría",
          variant: "destructive",
        });
      } else {
        toast({ title: "Éxito", description: "Categoría creada correctamente" });
        loadCategories(restaurantId);
      }
    }

    setCategoryDialogOpen(false);
    setCategoryName("");
    setEditingCategory(null);
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta categoría?")) return;

    const { error } = await supabase
      .from("categoriasmenu")
      .delete()
      .eq("categoria_id", categoryId);

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la categoría",
        variant: "destructive",
      });
    } else {
      toast({ title: "Éxito", description: "Categoría eliminada correctamente" });
      if (restaurantId) loadCategories(restaurantId);
    }
  };

  const handleSaveDish = async () => {
    if (!dishForm.nombre.trim() || !dishForm.categoria_id) return;

    // Validar que precio_venta y costo_produccion tengan valores
    if (!dishForm.precio_venta || !dishForm.costo_produccion) {
      toast({
        title: "Error",
        description: "Debes completar el precio de venta y el costo de producción",
        variant: "destructive",
      });
      return;
    }

    const dishData = {
      nombre: dishForm.nombre,
      descripcion: dishForm.descripcion || null,
      precio_venta: parseFloat(dishForm.precio_venta),
      costo_produccion: parseFloat(dishForm.costo_produccion),
      categoria_id: parseInt(dishForm.categoria_id),
      activo: true,
    };

    let platoId: number | null = null;

    if (editingDish) {
      const { error } = await supabase
        .from("platos")
        .update(dishData)
        .eq("plato_id", editingDish.plato_id);

      if (error) {
        toast({
          title: "Error",
          description: "No se pudo actualizar el plato",
          variant: "destructive",
        });
        return;
      }
      platoId = editingDish.plato_id;
    } else {
      const { data, error } = await supabase
        .from("platos")
        .insert(dishData)
        .select()
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "No se pudo crear el plato",
          variant: "destructive",
        });
        return;
      }
      platoId = data.plato_id;
    }

    // Subir imagen si se seleccionó una
    if (selectedImage && platoId) {
      const fileExt = selectedImage.name.split('.').pop();
      const fileName = `${platoId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("platos-imagenes")
        .upload(filePath, selectedImage);

      if (uploadError) {
        toast({
          title: "Error",
          description: "No se pudo subir la imagen",
          variant: "destructive",
        });
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from("platos-imagenes")
          .getPublicUrl(filePath);

        // Guardar URL en platos_imagenes
        const { error: imageError } = await supabase
          .from("platos_imagenes")
          .insert({
            plato_id: platoId,
            imagen_url: publicUrl,
          });

        if (imageError) {
          toast({
            title: "Advertencia",
            description: "El plato se guardó pero hubo un error al guardar la imagen",
            variant: "destructive",
          });
        }
      }
    }

    toast({ title: "Éxito", description: editingDish ? "Plato actualizado correctamente" : "Plato creado correctamente" });
    loadDishes();

    setDishDialogOpen(false);
    setDishForm({
      nombre: "",
      descripcion: "",
      precio_venta: "",
      costo_produccion: "",
      categoria_id: "",
    });
    setEditingDish(null);
    setSelectedImage(null);
    setPreviewImage(null);
  };

  const handleDeleteDish = async (dishId: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este plato?")) return;

    const { error } = await supabase
      .from("platos")
      .delete()
      .eq("plato_id", dishId);

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el plato",
        variant: "destructive",
      });
    } else {
      toast({ title: "Éxito", description: "Plato eliminado correctamente" });
      loadDishes();
    }
  };

  const openEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.nombre);
    setCategoryDialogOpen(true);
  };

  const openEditDish = (dish: Dish) => {
    setEditingDish(dish);
    setDishForm({
      nombre: dish.nombre,
      descripcion: dish.descripcion || "",
      precio_venta: dish.precio_venta.toString(),
      costo_produccion: dish.costo_produccion.toString(),
      categoria_id: dish.categoria_id.toString(),
    });
    setPreviewImage(dishImages[dish.plato_id] || null);
    setDishDialogOpen(true);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setPreviewImage(null);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate("/home")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Carta Digital</h1>
              <p className="text-muted-foreground">Gestiona las categorías y platos de tu menú</p>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Categorías del Menú</CardTitle>
                <CardDescription>Organiza tus platos por categorías</CardDescription>
              </div>
              <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setEditingCategory(null);
                      setCategoryName("");
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Categoría
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingCategory
                        ? "Modifica el nombre de la categoría"
                        : "Crea una nueva categoría para tu menú"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="category-name">Nombre de la Categoría</Label>
                      <Input
                        id="category-name"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        placeholder="Ej: Entrantes, Principales, Postres"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCategoryDialogOpen(false);
                        setCategoryName("");
                        setEditingCategory(null);
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveCategory}>Guardar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingCategories ? (
              <p className="text-center text-muted-foreground">Cargando categorías...</p>
            ) : categories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div
                    key={category.categoria_id}
                    className="p-4 rounded-lg border border-border hover:border-primary transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-foreground">{category.nombre}</h3>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditCategory(category)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteCategory(category.categoria_id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {dishes.filter((d) => d.categoria_id === category.categoria_id).length} platos
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <UtensilsCrossed className="w-12 h-12 mx-auto mb-3 opacity-50 text-muted-foreground" />
                <p className="text-muted-foreground">No hay categorías creadas</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dishes Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Platos del Menú</CardTitle>
                <CardDescription>Añade y gestiona los platos de tu carta</CardDescription>
              </div>
              <Dialog open={dishDialogOpen} onOpenChange={setDishDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setEditingDish(null);
                      setDishForm({
                        nombre: "",
                        descripcion: "",
                        precio_venta: "",
                        costo_produccion: "",
                        categoria_id: "",
                      });
                      setSelectedImage(null);
                      setPreviewImage(null);
                    }}
                    disabled={categories.length === 0}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Plato
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingDish ? "Editar Plato" : "Nuevo Plato"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingDish
                        ? "Modifica la información del plato"
                        : "Añade un nuevo plato a tu menú"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dish-name">Nombre del Plato *</Label>
                        <Input
                          id="dish-name"
                          value={dishForm.nombre}
                          onChange={(e) =>
                            setDishForm({ ...dishForm, nombre: e.target.value })
                          }
                          placeholder="Ej: Paella Valenciana"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dish-category">Categoría *</Label>
                        <select
                          id="dish-category"
                          value={dishForm.categoria_id}
                          onChange={(e) =>
                            setDishForm({ ...dishForm, categoria_id: e.target.value })
                          }
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="">Selecciona una categoría</option>
                          {categories.map((cat) => (
                            <option key={cat.categoria_id} value={cat.categoria_id}>
                              {cat.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="dish-description">Descripción</Label>
                      <Textarea
                        id="dish-description"
                        value={dishForm.descripcion}
                        onChange={(e) =>
                          setDishForm({ ...dishForm, descripcion: e.target.value })
                        }
                        placeholder="Describe los ingredientes y características del plato"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dish-price">Precio de Venta (€) *</Label>
                        <Input
                          id="dish-price"
                          type="number"
                          step="0.01"
                          value={dishForm.precio_venta}
                          onChange={(e) =>
                            setDishForm({ ...dishForm, precio_venta: e.target.value })
                          }
                          placeholder="12.50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dish-cost">Costo de Producción (€) *</Label>
                        <Input
                          id="dish-cost"
                          type="number"
                          step="0.01"
                          value={dishForm.costo_produccion}
                          onChange={(e) =>
                            setDishForm({ ...dishForm, costo_produccion: e.target.value })
                          }
                          placeholder="5.00"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="dish-image">Imagen del Plato</Label>
                      <div className="mt-2">
                        {previewImage ? (
                          <div className="relative">
                            <img
                              src={previewImage}
                              alt="Preview"
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2"
                              onClick={removeImage}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <label
                            htmlFor="dish-image"
                            className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
                          >
                            <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                            <span className="text-sm text-muted-foreground">
                              Haz clic para subir una imagen
                            </span>
                            <Input
                              id="dish-image"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageSelect}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setDishDialogOpen(false);
                        setDishForm({
                          nombre: "",
                          descripcion: "",
                          precio_venta: "",
                          costo_produccion: "",
                          categoria_id: "",
                        });
                        setEditingDish(null);
                        setSelectedImage(null);
                        setPreviewImage(null);
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveDish}>Guardar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingDishes ? (
              <p className="text-center text-muted-foreground">Cargando platos...</p>
            ) : categories.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Crea una categoría primero para añadir platos</p>
              </div>
            ) : dishes.length > 0 ? (
              <div className="space-y-6">
                {categories.map((category) => {
                  const categoryDishes = dishes.filter(
                    (d) => d.categoria_id === category.categoria_id
                  );
                  if (categoryDishes.length === 0) return null;

                  return (
                    <div key={category.categoria_id}>
                      <h3 className="text-lg font-semibold text-foreground mb-3">
                        {category.nombre}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {categoryDishes.map((dish) => (
                          <div
                            key={dish.plato_id}
                            className="rounded-lg border border-border hover:border-primary transition-colors overflow-hidden"
                          >
                            {dishImages[dish.plato_id] && (
                              <img
                                src={dishImages[dish.plato_id]}
                                alt={dish.nombre}
                                className="w-full h-48 object-cover"
                              />
                            )}
                            <div className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <h4 className="font-medium text-foreground">{dish.nombre}</h4>
                                  {dish.descripcion && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {dish.descripcion}
                                    </p>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => openEditDish(dish)}
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteDish(dish.plato_id)}
                                  >
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                  </Button>
                                </div>
                              </div>
                              <div className="flex justify-between items-center mt-3">
                                <div className="flex gap-4 text-sm">
                                  <span className="text-foreground font-semibold">
                                    {dish.precio_venta.toFixed(2)} €
                                  </span>
                                  <span className="text-muted-foreground">
                                    Costo: {dish.costo_produccion.toFixed(2)} €
                                  </span>
                                </div>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    dish.activo
                                      ? "bg-green-500/10 text-green-500"
                                      : "bg-gray-500/10 text-gray-500"
                                  }`}
                                >
                                  {dish.activo ? "Activo" : "Inactivo"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <UtensilsCrossed className="w-12 h-12 mx-auto mb-3 opacity-50 text-muted-foreground" />
                <p className="text-muted-foreground">No hay platos creados</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CartaDigital;
