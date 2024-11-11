const baseUrl = "https://mycorrhizal.deepseedgames.com/api:58ysOPHC";
// const header =
//   "eyJhbGciOiJBMjU2S1ciLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwiemlwIjoiREVGIn0.ot_kkyc2C7wuPEOXeIiGrh-ROET-5LOcF6K5pbRnU9wthy1GXQm6ybwQPd-d1mYARVXlUVlg7N0jiwM2LVB4abFbYaofQiCZ.ZrIlvouZZ5IhHrqDgx8eJg.RAWLTvbLfCLVM_URVEjCNVn50_i_hRyfiV03pc3_YdyPqG6toBYjZJQftrPwaKMtLlhMy_IcIUGqQV8jlTRuArsqV8vDNYR83aTfi21H2fEjHiVdCQIYtgJtjLMY88JVTfF6bZabz9W5fhiyDm_JOA.uCERSDRvnptXziqqGANIGbJkXG1lWLqjbOTHRvPNKIk";

const header =
  "eyJhbGciOiJBMjU2S1ciLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwiemlwIjoiREVGIn0.-dq_NF_jkRJNgot_89T2HDY-ex1HW4KvWzoEFbB7l55yNLx5m8abGUg0raGzyi8mQ-MQOTz3H8DDXuiOX4Bcn-HplPvxdJs0.XQ_7FvCg613sraJpNGVcoQ.IUZJ9pieJ9V9xB4442alHm-w9rLZHIr3TaCLr2iRRAOr-Xg0DbXRYRGWwxz7DKA6J3eXuTLlu0-6bXpKwyxTZIYON3nRN4NlzQbRFBNc076DJg_FrOOjq4XBexTkJLzb5ppiYZazwD8n72f0T-Km5w.HkjZVvleV37LUAsfHPvG8GIoAejbGpKqbz-JMwo2DVE";

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
