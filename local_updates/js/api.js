const baseUrl = "https://mycorrhizal.deepseedgames.com/api:58ysOPHC";
// stale:
const header =
  "eyJhbGciOiJBMjU2S1ciLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwiemlwIjoiREVGIn0.tqzVUgRzijBh6upyD2RvKOye0hXkg0ouHtHMJcIVlYXjmG8MRaJp9GF-_rVoW75kEHdP_osNKGWZrtS6T7fUl32wYGUH2vPv._FhZMUPzcldolG1xxEzvkA._fFl8RXLRmFP_lQhkC4xA3uuPny1KJEGDFglJIbHl2pYgbnnSuS9saBrVLgo0oJYDiqdufIh2Hn0c5dkYarYkkXT_gpHo4tILbZk9fHhcxre4uqAJypKweFiAJYrRDYo3OWl_5xZV8CZ2yKGadkvUg.ZTuLnBXQc6gn0Cwv0UDSl7lVWogV7OkZa0Cvd22ioy0";

// const header =
//   "eyJhbGciOiJBMjU2S1ciLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwiemlwIjoiREVGIn0.jM38o4mcuJ6sMMxT5CuhVg2yh5KAA2TkOUfLZ__2-O8gx9_A_b03e38E_AJnaEQKQy4lOJWd3qNY3uhi4Ezu9Rt2n_IgfcyC.w4kptbhwfJt9kTExXeX4Tg.PxVp30i7GaMXXRk62fyA-ReM5pYg433M-XlTwbTOhQaAXpoOtUjWqcfHGW5ETne8KHO35XuJ6DiqtBp_3q81q2SAR6jRCHeWwkjLFXafCNdJSg9Es0Jbe6q56XkpqBdm1yN_ojyoaxNiTpvCKCj4Lg.W_o5G84zughq4A6BjZQjhcV6GicN_uno1BvBhowSMfw";

const updateDeckDefaultPayload = {
  added_games: [],
  removed_games: [],
  iconsToUpdate: [],
  iconsToDelete: [],
  iconsToCreate: [],
};

const getUser = async (auth) => {
  try {
    const response = await fetch(`${baseUrl}/auth/me`, {
      headers: {
        // Authorization: sessionStorage.getItem("token"),
        Authorization: header,
      },
    });
    const data = await response.json();
    if (response.status === 401) {
      sessionStorage.setItem("isLoggedIn", false);
    }
    if (response.status === 200) {
      sessionStorage.setItem("isLoggedIn", true);
    }
    return data;
  } catch (error) {
    console.log(error);
  }
};

const fetchOrders = async () => {
  try {
    const response = await fetch(`${baseUrl}/user_orders`, {
      headers: {
        // Authorization: sessionStorage.getItem("token"),
        Authorization: header,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const saveOrder = async (data) => {
  const user = await getUser();
  try {
    await fetch(`${baseUrl}/user_orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: sessionStorage.getItem("token"),
        Authorization: header,
      },
      body: JSON.stringify({
        user_id: user.id,
        snipcart_token: data.token,
        metadata: data,
      }),
    });
  } catch (error) {
    console.log("error", error);
  }
};

const fetchOwnedGames = async () => {
  try {
    const response = await fetch(`${baseUrl}/owned-games`, {
      headers: {
        // Authorization: sessionStorage.getItem("token"),
        Authorization: header,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const listDecks = async () => {
  try {
    const response = await fetch(`${baseUrl}/deck`, {
      headers: {
        // Authorization: sessionStorage.getItem("token"),
        Authorization: header,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getDeck = async (id) => {
  try {
    const response = await fetch(`${baseUrl}/deck/${id}`, {
      headers: {
        // Authorization: sessionStorage.getItem("token"),
        Authorization: header,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("API Error: fetching deck", error);
  }
};

const updateDeck = async (payload, currentDeckId) => {
  try {
    const deck = await fetch(`${baseUrl}/deck/${currentDeckId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // Authorization: sessionStorage.getItem("token"),
        Authorization: header,
      },
      body: JSON.stringify({ ...updateDeckDefaultPayload, ...payload }),
    });
    const data = await deck.json();
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

const fetchAllGames = async () => {
  try {
    const response = await fetch(`${baseUrl}/game`, {
      headers: {
        // Authorization: sessionStorage.getItem("token"),
        Authorization: header,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const deleteDeck = async (id) => {
  try {
    await fetch(`${baseUrl}/deck/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // Authorization: sessionStorage.getItem("token"),
        Authorization: header,
      },
    });
  } catch (error) {
    console.log("error", error);
  }
};

const getFeaturedDecks = async () => {
  try {
    const response = await fetch(`${baseUrl}/featured-decks`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: header,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error fetching featured decks", error);
  }
};

const getFeaturedGames = async () => {
  try {
    const response = await fetch(`${baseUrl}/featured-games`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: header,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error fetching featured games", error);
  }
};

const duplicateDeck = async ({ deckId, isFeatured = false }) => {
  try {
    const deck = await fetch(
      `${baseUrl}/deck/duplicate/${deckId}?isFeatured=${isFeatured}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: sessionStorage.getItem("token"),
          Authorization: header,
        },
      }
    );
    const data = await deck.json();
    return data;
  } catch (error) {
    console.log("error", error);
  }
};
