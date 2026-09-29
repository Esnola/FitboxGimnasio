<?php

namespace App\Filament\Resources;

use App\Models\Member;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class MemberResource extends Resource
{
    protected static ?string $model = Member::class;

    protected static ?string $navigationIcon = 'heroicon-o-user-group';
    protected static ?string $navigationGroup = 'Gestión de Atletas';
    protected static ?string $modelLabel = 'Socio';
    protected static ?string $pluralModelLabel = 'Socios / Atletas';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Tabs::make('Detalles del Socio')
                    ->tabs([
                        Forms\Components\Tabs\Tab::make('Perfil y Membresía')
                            ->columns(2)
                            ->schema([
                                Forms\Components\TextInput::make('name')
                                    ->label('Nombre Completo')
                                    ->required(),

                                Forms\Components\TextInput::make('email')
                                    ->label('Email')
                                    ->email()
                                    ->required(),

                                Forms\Components\TextInput::make('member_code')
                                    ->label('Código Socio')
                                    ->default(fn () => '#FB-' . rand(1000, 9999))
                                    ->required(),

                                Forms\Components\Select::make('level')
                                    ->label('Nivel de Atleta')
                                    ->options([
                                        'RX' => 'RX (Competición / Avanzado)',
                                        'SCALED' => 'Scaled (Intermedio)',
                                        'PRO' => 'Elite Pro',
                                    ])
                                    ->default('RX')
                                    ->required(),

                                Forms\Components\Select::make('plan_id')
                                    ->label('Plan de Cuota')
                                    ->relationship('plan', 'name')
                                    ->required(),

                                Forms\Components\Select::make('plan_status')
                                    ->label('Estado Cuota')
                                    ->options([
                                        'active' => 'Activo',
                                        'paused' => 'Pausado',
                                        'expired' => 'Vencido',
                                    ])
                                    ->default('active'),

                                Forms\Components\DatePicker::make('plan_expiry')
                                    ->label('Vencimiento Cuota'),
                            ]),

                        Forms\Components\Tabs\Tab::make('Ficha Física y Médica')
                            ->columns(3)
                            ->schema([
                                Forms\Components\TextInput::make('weight_kg')
                                    ->label('Peso (kg)')
                                    ->numeric(),

                                Forms\Components\TextInput::make('height_cm')
                                    ->label('Altura (cm)')
                                    ->numeric(),

                                Forms\Components\TextInput::make('body_fat_percent')
                                    ->label('% Grasa Corporal')
                                    ->numeric(),

                                Forms\Components\TextInput::make('emergency_contact')
                                    ->label('Contacto de Emergencia')
                                    ->columnSpan(2),

                                Forms\Components\TextInput::make('medical_certificate_valid_until')
                                    ->label('Certificado Médico Válido Hasta')
                                    ->placeholder('Nov 2025'),
                            ]),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('member_code')
                    ->label('Socio')
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('name')
                    ->label('Nombre')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\BadgeColumn::make('level')
                    ->label('Nivel')
                    ->colors([
                        'success' => 'RX',
                        'warning' => 'SCALED',
                        'primary' => 'PRO',
                    ]),

                Tables\Columns\TextColumn::make('plan.name')
                    ->label('Cuota'),

                Tables\Columns\BadgeColumn::make('plan_status')
                    ->label('Estado')
                    ->colors([
                        'success' => 'active',
                        'warning' => 'paused',
                        'danger' => 'expired',
                    ]),

                Tables\Columns\TextColumn::make('monthly_attendances')
                    ->label('Asistencias Mes')
                    ->sortable(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ]);
    }
}
