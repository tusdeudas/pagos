"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  CreditCardIcon,
  AlertCircleIcon,
  DollarSignIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { ActionToken } from "@/actions";
import { ActionButton } from "@/components/action-button";

// Definición del tipo para los parámetros de búsqueda
type SearchParams = {
  assigned_to: string;
  event_type_uuid: string;
  event_type_name: string;
  event_start_time: string;
  event_end_time: string;
  invitee_uuid: string;
  invitee_first_name: string;
  invitee_last_name: string;
  invitee_email: string;
  answer_1: string;
  answer_2: string;
  answer_3: string;
  answer_4: string;
  answer_5: string;
  answer_6: string;
};

const cardFormSchema = z.object({
  cardNumber: z
    .string()
    .min(16, { message: "Número de tarjeta inválido" })
    .max(16, { message: "Número de tarjeta inválido" }),
  cardName: z
    .string()
    .min(2, { message: "Nombre debe tener al menos 2 caracteres" }),
  expirationDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, {
      message: "Fecha de expiración inválida (MM/YY)",
    })
    .min(5, { message: "Fecha de expiración inválida (MM/YY)" })
    .max(5, { message: "Fecha de expiración inválida (MM/YY)" }),
  cvv: z
    .string()
    .min(3, { message: "CVV inválido" })
    .max(3, { message: "CVV inválido" }),
});

const CreditCard = ({ cardData }: any) => (
  <div className="w-full max-w-md h-56 bg-gradient-to-r from-[#06196C] to-[#F0B66C] rounded-xl shadow-2xl p-8 text-white mb-8 transform hover:scale-105 transition-transform duration-300">
    <div className="flex justify-between items-center mb-8">
      <div className="text-2xl font-bold">Banco</div>
      {/* <div className="text-xl">VISA</div> */}
    </div>
    <div className="mb-8">
      <div className="text-xl tracking-widest">
        {cardData.cardNumber || "•••• •••• •••• ••••"}
      </div>
    </div>
    <div className="flex justify-between items-end">
      <div>
        <div className="text-xs uppercase mb-1">Nombre del titular</div>
        <div>{cardData.cardName || "NOMBRE APELLIDO"}</div>
      </div>
      <div>
        <div className="text-xs uppercase mb-1">Válido hasta</div>
        <div>{cardData.expirationDate || "MM/YY"}</div>
      </div>
    </div>
  </div>
);

const ReservationInfo = ({ searchParams }: { searchParams: SearchParams }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">
        Detalles de la Reserva
      </h2>
      <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <CalendarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Tipo de Evento
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  {searchParams.event_type_name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <ClockIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Fecha y Hora
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  {formatDate(searchParams.event_start_time)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <UserIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Cliente</p>
                <p className="text-lg font-semibold text-gray-800">{`${searchParams.invitee_first_name} ${searchParams.invitee_last_name}`}</p>
                <p className="text-sm text-gray-600">
                  {searchParams.invitee_email}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSignIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Precio</p>
                <p className="text-lg font-semibold text-gray-800">
                  {searchParams.answer_6}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Información Adicional
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <PhoneIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Teléfono</p>
                <p className="text-md text-gray-800">{searchParams.answer_1}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <CreditCardIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">RUT</p>
                <p className="text-md text-gray-800">{searchParams.answer_2}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <AlertCircleIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Importante</p>
                <p className="text-md text-gray-800">
                  Si el pago no se ha realizado 24 horas previas a la cita, la
                  reserva será cancelada.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <AlertCircleIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Importante</p>
                <p className="text-md text-gray-800">
                  Posterior al pago revisa el link de la asesoría en tu correo.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <AlertCircleIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Importante</p>
                <p className="text-md text-gray-800">
                  Si tienes algún inconveniente, escribenos al +56957559935
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function PaymentGateway({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardName: "",
    expirationDate: "",
    cvv: "",
  });

  const cardForm = useForm<z.infer<typeof cardFormSchema>>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      cardNumber: "",
      cardName: "",
      expirationDate: "",
      cvv: "",
    },
  });

  async function onSubmit(values: z.infer<typeof cardFormSchema>) {}

  const handleInputChange = (field: string, value: string) => {
    if (field === "expirationDate") {
      // Permitir borrar el "/"
      if (value.length === 2 && cardData.expirationDate.length === 3) {
        const newValue = value.slice(0, 1);
        setCardData((prev) => ({ ...prev, [field]: newValue }));
        cardForm.setValue("expirationDate", newValue);
        return;
      }

      // Eliminar cualquier caracter que no sea número, excepto "/"
      const cleanedValue = value.replace(/[^\d/]/g, "");

      // Formatear automáticamente
      let formattedValue = cleanedValue;
      if (cleanedValue.length > 2 && !cleanedValue.includes("/")) {
        formattedValue =
          cleanedValue.slice(0, 2) + "/" + cleanedValue.slice(2, 4);
      }

      // Limitar a 5 caracteres (MM/YY)
      formattedValue = formattedValue.slice(0, 5);

      // Actualizamos tanto cardData como el valor del campo del formulario
      setCardData((prev) => ({ ...prev, [field]: formattedValue }));
      cardForm.setValue("expirationDate", formattedValue);
    } else {
      setCardData((prev) => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Lado izquierdo: Información de la reserva */}
      <div className="w-1/2 p-8 overflow-y-auto self-center">
        <ReservationInfo searchParams={searchParams} />
      </div>

      {/* Lado derecho: Formulario de pago y simulación de tarjeta */}
      <div className="w-1/2 bg-white p-8 shadow-lg flex flex-col justify-center items-center">
        <Image
          src="/logo3 (1).png"
          width={300}
          height={300}
          alt="Logo"
          className=" mb-8"
        />
        <CreditCard cardData={cardData} />
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6">Datos de Pago</h2>
          <Form {...cardForm}>
            <form action={ActionToken} className="space-y-4">
              <input
                className="hidden"
                name="RUT"
                readOnly
                value={searchParams.answer_2}
              />
              <input
                className="hidden"
                name="email"
                readOnly
                value={searchParams.invitee_email}
              />
              <input
                className="hidden"
                name="first_name"
                readOnly
                value={searchParams.invitee_first_name}
              />
              <input
                className="hidden"
                name="last_name"
                readOnly
                value={searchParams.invitee_last_name}
              />
              <input
                className="hidden"
                name="amount"
                readOnly
                value={searchParams.answer_6}
              />
              <input
                className="hidden"
                name="rut"
                readOnly
                value={searchParams.answer_2}
              />

              <FormField
                control={cardForm.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Tarjeta</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="1234 5678 9012 3456"
                        maxLength={16}
                        minLength={16}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleInputChange("cardNumber", e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={cardForm.control}
                name="cardName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre en la Tarjeta</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Juan Pérez"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleInputChange("cardName", e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex space-x-4">
                <FormField
                  control={cardForm.control}
                  name="expirationDate"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Fecha de Expiración</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="MM/YY"
                          {...field}
                          onChange={(e) => {
                            handleInputChange("expirationDate", e.target.value);
                          }}
                          value={cardData.expirationDate}
                          maxLength={5}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={cardForm.control}
                  name="cvv"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>CVV</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handleInputChange("cvv", e.target.value);
                          }}
                          maxLength={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <ActionButton className="w-full bg-[#06196C] hover:bg-[#050E3A] text-white">
                Pagar
              </ActionButton>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
