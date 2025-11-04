# 🏪 Sistema de Cuadres - Estación Vista Hermosa

Sistema automatizado de cuadres diarios para estación de servicio y tienda de conveniencia.

## 🎯 Objetivo

Reducir el tiempo de cuadres diarios de **1.5 horas a 30 minutos** (~60% de ahorro) mediante la digitalización y automatización del proceso.

## ✨ Características

### Módulos Implementados

- **📁 Procesamiento de Fusion**: Upload y procesamiento automático de reportes CSV
- **⛽ Cuadres de Estación**: 4 turnos con 12 conceptos de entrada
- **🏪 Cuadres de Tienda**: 2 turnos con 14 conceptos (incluye delivery apps)
- **🏦 Control de Depósitos**: Gestión de 4 boletas bancarias diarias
- **📊 Consolidado Diario**: Vista unificada Estación + Tienda
- **⚙️ Módulos Auxiliares**: Placeholders para Fase 2

### Funcionalidades Core

✅ Carga automática de totales del sistema desde Fusion  
✅ Cálculo en tiempo real de diferencias  
✅ Validación visual con códigos de color  
✅ Guardado automático en PostgreSQL  
✅ Histórico completo de cuadres  
✅ Reportes consolidados por concepto  

## 🏗️ Stack Tecnológico

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de Datos**: PostgreSQL + Prisma ORM
- **Deployment**: Vercel + Supabase
- **Storage**: Supabase Storage (opcional)

## 📋 Prerequisitos

- Node.js 18 o superior
- PostgreSQL 14 o superior
- Cuenta en Supabase (free tier)
- Cuenta en Vercel (free tier, opcional)

## 🚀 Instalación Local

### 1. Clonar el Repositorio

```bash
git clone https://github.com/eljaimer/estacion-cuadres.git
cd estacion-cuadres
