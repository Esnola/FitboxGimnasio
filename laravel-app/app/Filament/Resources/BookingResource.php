<?php

namespace App\Filament\Resources;

use App\Models\Booking;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class BookingResource extends Resource
{
    protected static ?string $model = Booking::class;

    protected static ?string $navigationIcon = 'heroicon-o-ticket';
    protected static ?string $navigationGroup = 'Gestión de Atletas';
    protected static ?string $modelLabel = 'Reserva';
    protected static ?string $pluralModelLabel = 'Reservas y Asistencias';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('member_id')
                    ->label('Socio')
                    ->relationship('member', 'name')
                    ->searchable()
                    ->required(),

                Forms\Components\Select::make('gym_class_id')
                    ->label('Clase')
                    ->relationship('gymClass', 'title')
                    ->searchable()
                    ->required(),

                Forms\Components\TextInput::make('box_pass_code')
                    ->label('Código Pase QR')
                    ->required()
                    ->default(fn () => '#' . rand(1000, 9999)),

                Forms\Components\Select::make('status')
                    ->label('Estado de la Reserva')
                    ->options([
                        'confirmed' => 'Confirmada',
                        'waitlist' => 'Lista de Espera',
                        'cancelled' => 'Cancelada',
                    ])
                    ->default('confirmed')
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('box_pass_code')
                    ->label('Pase')
                    ->weight('bold')
                    ->searchable(),

                Tables\Columns\TextColumn::make('member.name')
                    ->label('Atleta')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('gymClass.title')
                    ->label('Clase')
                    ->searchable(),

                Tables\Columns\TextColumn::make('gymClass.date')
                    ->label('Fecha')
                    ->date('d/m/Y'),

                Tables\Columns\TextColumn::make('gymClass.start_time')
                    ->label('Hora'),

                Tables\Columns\BadgeColumn::make('status')
                    ->label('Estado')
                    ->colors([
                        'success' => 'confirmed',
                        'warning' => 'waitlist',
                        'danger' => 'cancelled',
                    ]),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Registrada')
                    ->dateTime('d/m/Y H:i'),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'confirmed' => 'Confirmadas',
                        'waitlist' => 'En Espera',
                        'cancelled' => 'Canceladas',
                    ]),
            ])
            ->actions([
                Tables\Actions\Action::make('checkIn')
                    ->label('Validar Entrada')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->action(fn (Booking $record) => $record->member->increment('monthly_attendances')),

                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ]);
    }
}
