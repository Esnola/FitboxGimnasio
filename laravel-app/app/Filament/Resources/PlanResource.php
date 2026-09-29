<?php

namespace App\Filament\Resources;

use App\Models\Plan;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class PlanResource extends Resource
{
    protected static ?string $model = Plan::class;

    protected static ?string $navigationIcon = 'heroicon-o-credit-card';
    protected static ?string $navigationGroup = 'Facturación y Cuotas';
    protected static ?string $modelLabel = 'Plan de Cuota';
    protected static ?string $pluralModelLabel = 'Planes de Membresía';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('id')
                    ->label('ID Plan')
                    ->required()
                    ->placeholder('plan-rx'),

                Forms\Components\TextInput::make('name')
                    ->label('Nombre del Plan')
                    ->required(),

                Forms\Components\TextInput::make('tag')
                    ->label('Etiqueta')
                    ->placeholder('MÁS POPULAR / 3 DÍAS'),

                Forms\Components\TextInput::make('price_monthly')
                    ->label('Precio Mensual (€)')
                    ->numeric()
                    ->prefix('€')
                    ->required(),

                Forms\Components\TextInput::make('price_annual_monthly')
                    ->label('Precio Anual (€/mes)')
                    ->numeric()
                    ->prefix('€')
                    ->required(),

                Forms\Components\Textarea::make('description')
                    ->label('Descripción Breve')
                    ->columnSpanFull(),

                Forms\Components\TagsInput::make('features')
                    ->label('Ventajas y Beneficios incluidos')
                    ->columnSpanFull(),

                Forms\Components\Toggle::make('is_popular')
                    ->label('Destacar como Más Popular'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Plan')
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('price_monthly')
                    ->label('Mensual')
                    ->money('EUR'),

                Tables\Columns\TextColumn::make('price_annual_monthly')
                    ->label('Anual (mes)')
                    ->money('EUR'),

                Tables\Columns\IconColumn::make('is_popular')
                    ->label('Destacado')
                    ->boolean(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ]);
    }
}
