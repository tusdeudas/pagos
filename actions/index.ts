"use server";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

async function notifyMake(rut: string, status: "Success" | "Rejected") {
  const webhookUrl =
    "https://hook.us1.make.com/ssx7bakbmix5vt7iwxcuo4uci8297m8n";

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rut, status }),
    });

    if (!response.ok) {
      throw new Error(`Error al notificar a Make.com: ${response.status}`);
    }

    console.log("Notificación enviada a Make.com:", { rut, status });
  } catch (error) {
    console.error("Error al notificar a Make.com:", error);
  }
}

export async function ActionToken(formData: FormData) {
  const cardNumber = formData.get("cardNumber") as string;
  const cardHolder = formData.get("cardName") as string;
  const cardExpiration = formData.get("expirationDate") as string;
  const cardCvv = formData.get("cvv") as string;
  const amount = formData.get("amount") as string;
  const email = formData.get("email") as string;
  const first_name = formData.get("first_name") as string;
  const last_name = formData.get("last_name") as string;
  const rut = formData.get("rut") as string;

  let numericAmount = parseFloat(
    amount
      .replace(/[^0-9,-]+/g, "")
      .replace(",", "")
      .replace(".", "")
  );

  const headers = {
    "Content-Type": "application/json",
    Authorization:
      "Bearer TEST-933291264399268-062811-622a1ff510efa387f2dc6bc2660496bc-1874139806",
  };

  try {
    // Primer fetch: Obtener el token de la tarjeta
    const tokenResponse = await fetch(
      `https://api.mercadopago.com/v1/card_tokens?public_key=TEST-e02fd76a-22f5-40a7-bc0f-2a0c8bc23cc3`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          card_number: cardNumber,
          cardholder: {
            name: cardHolder,
            identification: {
              type: "",
              number: "",
            },
          },
          security_code: cardCvv,
          expiration_month: cardExpiration.split("/")[0],
          expiration_year: `20${cardExpiration.split("/")[1]}`,
        }),
      }
    );

    if (!tokenResponse.ok) {
      return {
        status: "error",
        message: "Error al obtener el token de tarjeta",
      };
    }

    const tokenData = await tokenResponse.json();
    console.log("Token de tarjeta:", tokenData.id);

    // Segundo fetch: Buscar el cliente
    const customerSearchResponse = await fetch(
      `https://api.mercadopago.com/v1/customers/search?email=${encodeURIComponent(
        email
      )}`,
      {
        method: "GET",
        headers,
      }
    );

    if (!customerSearchResponse.ok) {
      return { status: "error", message: "Error al buscar el cliente" };
    }

    const customerSearchData = await customerSearchResponse.json();
    let customerId;

    if (customerSearchData.results.length > 0) {
      customerId = customerSearchData.results[0].id;
      console.log(
        "Cliente existente encontrado:",
        customerId,
        customerSearchData.results[0]
      );
    } else {
      // Crear nuevo cliente si no existe
      const newCustomerResponse = await fetch(
        "https://api.mercadopago.com/v1/customers",
        {
          method: "POST",
          headers: {
            ...headers,
          },
          body: JSON.stringify({
            email,
            first_name,
            last_name,
          }),
        }
      );

      if (!newCustomerResponse.ok) {
        return { status: "error", message: "Error al crear el cliente" };
      }

      const newCustomerData = await newCustomerResponse.json();
      customerId = newCustomerData.id;
      console.log("Nuevo cliente creado:", customerId);
    }

    // Tercer fetch: Procesar el pago
    const paymentResponse = await fetch(
      "https://api.mercadopago.com/v1/payments",
      {
        method: "POST",
        headers: {
          ...headers,
          "X-Idempotency-Key": uuidv4(),
        },
        body: JSON.stringify({
          transaction_amount: numericAmount,
          token: tokenData.id,
          installments: 1,
          payer: {
            type: "customer",
            id: customerId,
          },
          description: "Pago de Reserva",
        }),
      }
    );

    if (!paymentResponse.ok) {
      return { status: "error", message: "Error al procesar el pago" };
    }

    const paymentData = await paymentResponse.json();
    console.log("Pago procesado:", paymentData);

    if (paymentData.status === "approved") {
      await notifyMake(rut, "Success");
    } else {
      await notifyMake(rut, "Rejected");
    }

    return { status: "success", message: "Pago procesado correctamente" };
  } catch (error) {
    // Notificar a Make.com en caso de error
    await notifyMake(rut, "Rejected");
    return {
      status: "error",
      message: "Error al procesar el pago",
      err: error,
    };
  }
}
