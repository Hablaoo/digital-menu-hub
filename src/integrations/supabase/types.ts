export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      categoriasmenu: {
        Row: {
          categoria_id: number
          created_at: string | null
          nombre: string
          orden: number | null
          restaurante_id: number
        }
        Insert: {
          categoria_id?: number
          created_at?: string | null
          nombre: string
          orden?: number | null
          restaurante_id: number
        }
        Update: {
          categoria_id?: number
          created_at?: string | null
          nombre?: string
          orden?: number | null
          restaurante_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "categoriasmenu_restaurante_id_fkey"
            columns: ["restaurante_id"]
            isOneToOne: false
            referencedRelation: "restaurantes"
            referencedColumns: ["restaurante_id"]
          },
        ]
      }
      clientes: {
        Row: {
          cliente_id: number
          created_at: string | null
          email: string | null
          nombre: string
          notas: string | null
          telefono: string
        }
        Insert: {
          cliente_id?: number
          created_at?: string | null
          email?: string | null
          nombre: string
          notas?: string | null
          telefono: string
        }
        Update: {
          cliente_id?: number
          created_at?: string | null
          email?: string | null
          nombre?: string
          notas?: string | null
          telefono?: string
        }
        Relationships: []
      }
      conversaciones: {
        Row: {
          created_at: string
          id: number
          mensaje: string | null
          nombre: string | null
          restaurante_id: number | null
          telefono: string | null
          tipo_mensaje: Database["public"]["Enums"]["tipo_mensaje"] | null
        }
        Insert: {
          created_at?: string
          id?: number
          mensaje?: string | null
          nombre?: string | null
          restaurante_id?: number | null
          telefono?: string | null
          tipo_mensaje?: Database["public"]["Enums"]["tipo_mensaje"] | null
        }
        Update: {
          created_at?: string
          id?: number
          mensaje?: string | null
          nombre?: string | null
          restaurante_id?: number | null
          telefono?: string | null
          tipo_mensaje?: Database["public"]["Enums"]["tipo_mensaje"] | null
        }
        Relationships: [
          {
            foreignKeyName: "conversaciones_restaurante_id_fkey"
            columns: ["restaurante_id"]
            isOneToOne: false
            referencedRelation: "restaurantes"
            referencedColumns: ["restaurante_id"]
          },
        ]
      }
      detallespedido: {
        Row: {
          cantidad: number
          detalle_id: number
          fecha_hora_pedido: string | null
          pedido_id: number
          plato_id: number
          precio_en_ese_momento: number
        }
        Insert: {
          cantidad?: number
          detalle_id?: number
          fecha_hora_pedido?: string | null
          pedido_id: number
          plato_id: number
          precio_en_ese_momento: number
        }
        Update: {
          cantidad?: number
          detalle_id?: number
          fecha_hora_pedido?: string | null
          pedido_id?: number
          plato_id?: number
          precio_en_ese_momento?: number
        }
        Relationships: [
          {
            foreignKeyName: "detallespedido_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["pedido_id"]
          },
          {
            foreignKeyName: "detallespedido_plato_id_fkey"
            columns: ["plato_id"]
            isOneToOne: false
            referencedRelation: "platos"
            referencedColumns: ["plato_id"]
          },
        ]
      }
      mesas: {
        Row: {
          capacidad: number
          created_at: string | null
          mesa_id: number
          nombre_o_numero: string
          restaurante_id: number
          ubicacion: string | null
        }
        Insert: {
          capacidad: number
          created_at?: string | null
          mesa_id?: number
          nombre_o_numero: string
          restaurante_id: number
          ubicacion?: string | null
        }
        Update: {
          capacidad?: number
          created_at?: string | null
          mesa_id?: number
          nombre_o_numero?: string
          restaurante_id?: number
          ubicacion?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mesas_restaurante_id_fkey"
            columns: ["restaurante_id"]
            isOneToOne: false
            referencedRelation: "restaurantes"
            referencedColumns: ["restaurante_id"]
          },
        ]
      }
      pedidos: {
        Row: {
          cliente_id: number | null
          estado: string | null
          fecha_hora: string | null
          pedido_id: number
          reserva_id: number | null
          restaurante_id: number
          total_pedido: number | null
        }
        Insert: {
          cliente_id?: number | null
          estado?: string | null
          fecha_hora?: string | null
          pedido_id?: number
          reserva_id?: number | null
          restaurante_id: number
          total_pedido?: number | null
        }
        Update: {
          cliente_id?: number | null
          estado?: string | null
          fecha_hora?: string | null
          pedido_id?: number
          reserva_id?: number | null
          restaurante_id?: number
          total_pedido?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["cliente_id"]
          },
          {
            foreignKeyName: "pedidos_reserva_id_fkey"
            columns: ["reserva_id"]
            isOneToOne: false
            referencedRelation: "reservas"
            referencedColumns: ["reserva_id"]
          },
          {
            foreignKeyName: "pedidos_restaurante_id_fkey"
            columns: ["restaurante_id"]
            isOneToOne: false
            referencedRelation: "restaurantes"
            referencedColumns: ["restaurante_id"]
          },
        ]
      }
      pedidos_mesas: {
        Row: {
          mesa_id: number
          pedido_id: number
        }
        Insert: {
          mesa_id: number
          pedido_id: number
        }
        Update: {
          mesa_id?: number
          pedido_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_mesas_mesa_id_fkey"
            columns: ["mesa_id"]
            isOneToOne: false
            referencedRelation: "mesas"
            referencedColumns: ["mesa_id"]
          },
          {
            foreignKeyName: "pedidos_mesas_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["pedido_id"]
          },
        ]
      }
      perfiles: {
        Row: {
          id: string
          nombre: string | null
          rol: string
        }
        Insert: {
          id: string
          nombre?: string | null
          rol?: string
        }
        Update: {
          id?: string
          nombre?: string | null
          rol?: string
        }
        Relationships: []
      }
      platos: {
        Row: {
          activo: boolean | null
          categoria_id: number
          costo_produccion: number
          created_at: string | null
          descripcion: string | null
          nombre: string
          plato_id: number
          precio_venta: number
        }
        Insert: {
          activo?: boolean | null
          categoria_id: number
          costo_produccion: number
          created_at?: string | null
          descripcion?: string | null
          nombre: string
          plato_id?: number
          precio_venta: number
        }
        Update: {
          activo?: boolean | null
          categoria_id?: number
          costo_produccion?: number
          created_at?: string | null
          descripcion?: string | null
          nombre?: string
          plato_id?: number
          precio_venta?: number
        }
        Relationships: [
          {
            foreignKeyName: "platos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categoriasmenu"
            referencedColumns: ["categoria_id"]
          },
        ]
      }
      reservas: {
        Row: {
          cliente_id: number
          created_at: string | null
          estado: Database["public"]["Enums"]["estado_reserva"]
          fecha_hora: string
          notas_reserva: string | null
          numero_personas: number
          reserva_id: number
          restaurante_id: number
        }
        Insert: {
          cliente_id: number
          created_at?: string | null
          estado?: Database["public"]["Enums"]["estado_reserva"]
          fecha_hora: string
          notas_reserva?: string | null
          numero_personas: number
          reserva_id?: number
          restaurante_id: number
        }
        Update: {
          cliente_id?: number
          created_at?: string | null
          estado?: Database["public"]["Enums"]["estado_reserva"]
          fecha_hora?: string
          notas_reserva?: string | null
          numero_personas?: number
          reserva_id?: number
          restaurante_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "reservas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["cliente_id"]
          },
          {
            foreignKeyName: "reservas_restaurante_id_fkey"
            columns: ["restaurante_id"]
            isOneToOne: false
            referencedRelation: "restaurantes"
            referencedColumns: ["restaurante_id"]
          },
        ]
      }
      reservas_mesas: {
        Row: {
          mesa_id: number
          reserva_id: number
        }
        Insert: {
          mesa_id: number
          reserva_id: number
        }
        Update: {
          mesa_id?: number
          reserva_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "reservas_mesas_mesa_id_fkey"
            columns: ["mesa_id"]
            isOneToOne: false
            referencedRelation: "mesas"
            referencedColumns: ["mesa_id"]
          },
          {
            foreignKeyName: "reservas_mesas_reserva_id_fkey"
            columns: ["reserva_id"]
            isOneToOne: false
            referencedRelation: "reservas"
            referencedColumns: ["reserva_id"]
          },
        ]
      }
      restaurantes: {
        Row: {
          created_at: string | null
          descripcion: string | null
          direccion: string | null
          horario: Json | null
          nombre: string
          restaurante_id: number
          telefono: string | null
          telefono_chat: string | null
          usuario_id: string
        }
        Insert: {
          created_at?: string | null
          descripcion?: string | null
          direccion?: string | null
          horario?: Json | null
          nombre: string
          restaurante_id?: number
          telefono?: string | null
          telefono_chat?: string | null
          usuario_id: string
        }
        Update: {
          created_at?: string | null
          descripcion?: string | null
          direccion?: string | null
          horario?: Json | null
          nombre?: string
          restaurante_id?: number
          telefono?: string | null
          telefono_chat?: string | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurantes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      estado_reserva:
        | "Pendiente"
        | "Confirmada"
        | "Cancelada"
        | "Completada"
        | "No Show"
      tipo_mensaje: "Enviado" | "Recibido"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      estado_reserva: [
        "Pendiente",
        "Confirmada",
        "Cancelada",
        "Completada",
        "No Show",
      ],
      tipo_mensaje: ["Enviado", "Recibido"],
    },
  },
} as const
