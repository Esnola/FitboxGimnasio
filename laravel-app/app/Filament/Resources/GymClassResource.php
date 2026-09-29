<?php

namespace App\Filament\Resources;

use App\Models\GymClass;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class GymClassResource extends Resource
{
    protected static ?string $model = GymClass::class;

    protected static ?string $navigationIcon = 'heroicon-o-calendar-days';
    protected static ?string $navigationGroup = 'Programación del Box';
    protected static ?string $modelLabel = 'Clase';
    protected static ?string $pluralModelLabel = 'Clases y WODs';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Información Principal')
                    ->columns(2)
                    ->schema([
                        Forms\Components\TextInput::make('id')
                            ->label('Identificador')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->placeholder('ej. class-25-1830'),

                        Forms\Components\TextInput::make('title')
                            ->label('Título de la Clase')
                            ->required()
                            ->placeholder('CROSSFIT WOD, HALTEROFILIA...'),

                        Forms\Components\Select::make('category')
                            ->label('Categoría')
                            ->options([
                                'crossfit' => 'CrossFit WOD',
                                'halterofilia' => 'Halterofilia / Oly',
                                'endurance' => 'Endurance & HIIT',
                                'openbox' => 'Open Box Libre',
                                'mobility' => 'Mobility & Recovery',
                            ])
                            ->required(),

                        Forms\Components\TextInput::make('location')
                            ->label('Ubicación / Pista')
                            ->default('Box Principal'),

                        Forms\Components\TextInput::make('sublabel')
                            ->label('Subtítulo / Enfoque')
                            ->placeholder('WOD del día programado'),

                        Forms\Components\TextInput::make('intensity')
                            ->label('Nivel de Intensidad')
                            ->placeholder('Alta / Muy Alta / Libre'),
                    ]),

                Forms\Components\Section::make('Coach y Horarios')
                    ->columns(3)
                    ->schema([
                        Forms\Components\TextInput::make('coach_name')
                            ->label('Nombre del Coach')
                            ->required(),

                        Forms\Components\TextInput::make('coach_initials')
                            ->label('Iniciales Coach')
                            ->maxLength(5)
                            ->required(),

                        Forms\Components\DatePicker::make('date')
                            ->label('Fecha')
                            ->required(),

                        Forms\Components\TimePicker::make('start_time')
                            ->label('Hora Inicio')
                            ->required(),

                        Forms\Components\TimePicker::make('end_time')
                            ->label('Hora Fin')
                            ->required(),

                        Forms\Components\TextInput::make('duration_minutes')
                            ->label('Duración (min)')
                            ->numeric()
                            ->default(60),
                    ]),

                Forms\Components\Section::make('Capacidad y Cupos')
                    ->columns(3)
                    ->schema([
                        Forms\Components\TextInput::make('max_capacity')
                            ->label('Aforo Máximo')
                            ->numeric()
                            ->default(16)
                            ->required(),

                        Forms\Components\TextInput::make('booked_count')
                            ->label('Plazas Reservadas')
                            ->numeric()
                            ->default(0),

                        Forms\Components\TextInput::make('waitlist_count')
                            ->label('En Lista de Espera')
                            ->numeric()
                            ->default(0),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('date')
                    ->label('Fecha')
                    ->date('d/m/Y')
                    ->sortable(),

                Tables\Columns\TextColumn::make('start_time')
                    ->label('Horario')
                    ->formatStateUsing(fn ($record) => substr($record->start_time, 0, 5) . ' - ' . substr($record->end_time, 0, 5)),

                Tables\Columns\TextColumn::make('title')
                    ->label('Clase')
                    ->weight('bold')
                    ->searchable(),

                Tables\Columns\BadgeColumn::make('category')
                    ->label('Categoría')
                    ->colors([
                        'primary' => 'crossfit',
                        'warning' => 'halterofilia',
                        'success' => 'endurance',
                        'info' => 'openbox',
                    ]),

                Tables\Columns\TextColumn::make('coach_name')
                    ->label('Coach'),

                Tables\Columns\TextColumn::make('booked_count')
                    ->label('Ocupación')
                    ->formatStateUsing(fn ($record) => "{$record->booked_count}/{$record->max_capacity}")
                    ->color(fn ($record) => $record->booked_count >= $record->max_capacity ? 'danger' : 'success'),

                Tables\Columns\TextColumn::make('waitlist_count')
                    ->label('Espera')
                    ->badge(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('category')
                    ->options([
                        'crossfit' => 'CrossFit',
                        'halterofilia' => 'Halterofilia',
                        'endurance' => 'Endurance',
                        'openbox' => 'Open Box',
                    ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}
