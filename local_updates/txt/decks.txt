$(document).ready(async function () {
  let allDecks = [];
  let currentDeckId;
  let deckGames = [];
  let allGames = [];
  const gamesToAdd = new Set();
  try {
    const preselectedDeck = sessionStorage.getItem("clickedDeck");
    let decks = [];
    if (sessionStorage.getItem("isLoggedIn") == "false") {
      $(".delete-deck-icon").css("display", "none");
      $(".edit-deck-icon").css("display", "none");
      decks = await getFeaturedDecks();
    } else {
      decks = await listDecks();
    }
    allDecks = decks;
    const deckTabs = generateTabs(decks, preselectedDeck);
    $(deckTabs.join("")).insertBefore(".create-deck");

    const activeTabName = $(".deck-tab.is-active div").html();
    const activeTab = $(".deck-tab.is-active")[0];
    const activeTabId = preselectedDeck || $(activeTab).attr("data-id");
    sessionStorage.removeItem("clickedDeck");
    currentDeckId = activeTabId;
    const { deckLength } = await renderDeck(decks, activeTabId);

    $(".deck-category").html(activeTabName);
    $(".number-of-games").html(deckLength);
  } catch (error) {
    console.log(error);
  }

  $(".deck-tab").on("click", async function (el) {
    const selectedTabId = $(el.currentTarget).attr("data-id");
    currentDeckId = selectedTabId;
    const selectedTabName = $(el.currentTarget).html();
    const {
      deckGameIcons,
      removed_games: removedGames,
      added_games: addedGames,
    } = allDecks.find(({ id }) => id == selectedTabId);
    const selectedDeckGames = await getDeckGames({
      deckGameIcons,
      removedGames: removedGames?.filter((rg) => rg),
      addedGames: addedGames?.filter((ag) => ag),
    });
    showDeckGames(selectedDeckGames);
    deckGames = selectedDeckGames;
    $(".deck-category").html(selectedTabName);
    $(".number-of-games").html(selectedDeckGames.length);
    $(".deck-tab.is-active").removeClass("is-active");
    $(el.currentTarget).addClass("is-active");
  });

  $(".create-deck").on("click", (el) => {
    window.location.href = window.location.origin + "/create-a-deck";
  });

  $(".edit-deck-icon").on("click", (el) => {
    window.location.href =
      window.location.origin + "/edit-deck?id=" + currentDeckId;
  });

  $(".delete-deck-icon").on("click", async (el) => {
    const deckName = $(".deck-category").html();
    const deckId = $(".deck-tab.is-active").attr("data-id");
    const confirmDelete = confirm(
      `Are you sure you want to delete ${deckName}`
    );
    if (confirmDelete) {
      await deleteDeck(deckId);
      location.reload();
    }
  });

  $(".decks-container").on("click", ".delete-game-icon", async (e) => {
    const gameId = $(e.currentTarget.parentNode).attr("data-id");
    const gameName = $(e.currentTarget.parentNode).attr("data-name");
    const confirmDelete = window.confirm(
      "Are you sure you want to delete " + gameName
    );
    if (confirmDelete) {
      try {
        const deck = await updateDeck(
          { removed_games: [gameId] },
          currentDeckId
        );
        const latestDecks = await refreshDeck(deck, allDecks);
        await renderDeck(latestDecks, currentDeckId);
      } catch (error) {
        console.log("error", error);
      }
    }
  });

  $(".deck-search").on("keyup", (e) => {
    e.preventDefault();
    const filter = e.target.value;
    const search = gameSearch(filter, deckGames);
    showDeckGames(search);
  });

  $(".search-games-btn").on("click", async (e) => {
    try {
      const games = await fetchAllGames();
      allGames = games;
      renderModalGames(games, deckGames);
    } catch (error) {
      console.log("error fetching games for search modal:", error);
    }
  });

  $(".all-games-search").on("keyup", (e) => {
    e.preventDefault();
    const searchedGames = filterModalGames(allGames, e.target.value);
    renderModalGames(searchedGames, deckGames);
  });

  $(".search-modal-wrapper").on("click", ".game-body", (e) => {
    $(e.currentTarget).find(".card-item").toggleClass("game-to-add");
    const selectdGameId = $(e.currentTarget.parentNode).attr("data-id");
    if (gamesToAdd.has(selectdGameId)) {
      gamesToAdd.delete(selectdGameId);
    } else {
      gamesToAdd.add(selectdGameId);
    }
  });

  $(".add-games-btn").on("click", async (e) => {
    const updatedDeck = await updateDeck(
      { added_games: Array.from(gamesToAdd) },
      currentDeckId
    );
    gamesToAdd.clear();
    $(".search-modal-wrapper").css({ display: "none", opacity: 0 });
    const latestDecks = await refreshDeck(updatedDeck, allDecks);
    await renderDeck(latestDecks, currentDeckId);
  });

  $(".search-modal-actions").on("click", () => {
    $(".deck-search").val("");
  });

  $(".decks-container").on("click", ".game-body", async function (e) {
    const gameId = $(e.currentTarget.parentNode).attr("data-id");
    if ("URLSearchParams" in window) {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("gameId", gameId);
      const newRelativePathQuery =
        window.location.pathname + "?" + searchParams.toString();
      history.pushState(null, "", newRelativePathQuery);
    }

    $(".game-info-modal").css("display", "block");
    $(".game-info-modal").css("opacity", "100");
    $(".game-pop-up").css("display", "block");
    hideCollestionDropDown();
    const otherDecks = allDecks.filter((deck) => deck.id != currentDeckId);
    await renderGameModalContent({ addableDecks: otherDecks });
  });

  $(".video-thumbnails").on("click", "swiper-slide", (el) => {
    const type = $(el.currentTarget).attr("data-type");
    const src = $(el.currentTarget).attr("data-src");
    setBannerSlide({ type, src });
  });

  document.addEventListener("snipcart.ready", () => {
    Snipcart.events.on("cart.confirmed", async (cartConfirmResponse) => {
      await saveOrder(cartConfirmResponse);
    });
    $(".add-all-to-cart").on("click", async () => {
      await addAllToCart(deckGames);
    });
  });
});

const generateTabs = (decks, activeDeckId) => {
  const deckTabs = decks.map(
    (deck, i) =>
      `<div class="deck-tab ${
        activeDeckId
          ? deck.id == activeDeckId && "is-active"
          : i == 0 && "is-active"
      }" data-id=${deck.id}><div>${deck.name}</div></div>`
  );
  return deckTabs;
};

const gameDeckLayout = ({ games, showDeleteIcon = true }) => {
  const gameEls = games.map((game) => {
    const productUrl = `${baseUrl}/game-product/${game.id}`;
    const gameFront = gameCardFront(game);
    const gameBack = gameCardBack(game);
    const gameCard = `
      <div class="card-stacked" data-id=${game.id} data-name="${game.name}">
        <div class="game-body">
          <swiper-container init="false" class="card-flip${
            game.id
          }" data-game-id=${game.id}>
            <swiper-slide>
              ${gameFront}
            </swiper-slide>
            <swiper-slide>
              ${gameBack}
            </swiper-slide>
          </swiper-container>
        </div>
        ${gameCartIcon(game, productUrl)}
        ${showDeleteIcon ? deleteGameIcon : ""}
        <div class="prev prev${game.id} game-icon-circle is-eye-icon">
          <div class="game-cart-icon w-embed">
            <svg width="23" height="17" viewBox="0 0 23 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M11.4999 0.3125C6.70825 0.3125 2.61617 3.29292 0.958252 7.5C2.61617 11.7071 6.70825 14.6875 11.4999 14.6875C11.8449 14.6875 12.1899 14.6875 12.5349 14.6396C12.4856 14.3386 12.46 14.0342 12.4583 13.7292C12.4583 13.3842 12.4966 13.0392 12.5541 12.6942C12.2091 12.7325 11.8545 12.7708 11.4999 12.7708C7.89658 12.7708 4.62867 10.72 3.04742 7.5C3.822 5.91846 5.02475 4.58595 6.51896 3.65396C8.01317 2.72198 9.73888 2.2279 11.4999 2.2279C13.261 2.2279 14.9867 2.72198 16.4809 3.65396C17.9751 4.58595 19.1778 5.91846 19.9524 7.5C19.8374 7.73 19.7033 7.93125 19.5787 8.15167C20.2112 8.305 20.8149 8.56375 21.3612 8.9375C21.6199 8.45833 21.8499 7.97917 22.0416 7.5C20.3837 3.29292 16.2916 0.3125 11.4999 0.3125ZM11.4999 4.625C9.90908 4.625 8.62492 5.90917 8.62492 7.5C8.62492 9.09083 9.90908 10.375 11.4999 10.375C13.0908 10.375 14.3749 9.09083 14.3749 7.5C14.3749 5.90917 13.0908 4.625 11.4999 4.625ZM17.2499 10.375V12.2917H21.0833V14.2083H17.2499V16.125L14.3749 13.25L17.2499 10.375Z"
                fill="#FFEDC6"><
              /path>
            </svg>
          </div>
        </div>
        <div class="next${game.id} game-icon-circle is-eye-icon">
          <div class="game-cart-icon w-embed">
            <svg width="23" height="17" viewBox="0 0 23 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M11.4999 0.3125C6.70825 0.3125 2.61617 3.29292 0.958252 7.5C2.61617 11.7071 6.70825 14.6875 11.4999 14.6875C11.8449 14.6875 12.1899 14.6875 12.5349 14.6396C12.4856 14.3386 12.46 14.0342 12.4583 13.7292C12.4583 13.3842 12.4966 13.0392 12.5541 12.6942C12.2091 12.7325 11.8545 12.7708 11.4999 12.7708C7.89658 12.7708 4.62867 10.72 3.04742 7.5C3.822 5.91846 5.02475 4.58595 6.51896 3.65396C8.01317 2.72198 9.73888 2.2279 11.4999 2.2279C13.261 2.2279 14.9867 2.72198 16.4809 3.65396C17.9751 4.58595 19.1778 5.91846 19.9524 7.5C19.8374 7.73 19.7033 7.93125 19.5787 8.15167C20.2112 8.305 20.8149 8.56375 21.3612 8.9375C21.6199 8.45833 21.8499 7.97917 22.0416 7.5C20.3837 3.29292 16.2916 0.3125 11.4999 0.3125ZM11.4999 4.625C9.90908 4.625 8.62492 5.90917 8.62492 7.5C8.62492 9.09083 9.90908 10.375 11.4999 10.375C13.0908 10.375 14.3749 9.09083 14.3749 7.5C14.3749 5.90917 13.0908 4.625 11.4999 4.625ZM17.2499 10.375V12.2917H21.0833V14.2083H17.2499V16.125L14.3749 13.25L17.2499 10.375Z"
                fill="#FFEDC6"><
              /path>
            </svg>
          </div>
        </div>
      </div>
    `;
    return gameCard;
  });
  return gameEls;
};

const showDeckGames = (games) => {
  const deckLayout = gameDeckLayout({ games, showDeleteIcon: true });
  const parser = new DOMParser();
  const doc = parser.parseFromString(deckLayout.join("\n"), "text/html");
  $(".decks-container").html(doc.body.children);
  games.forEach(({ id }) =>
    initialiseFlipper({ gameId: id, parentClass: "decks-container" })
  );
};

const gameSearch = (filter, games) => {
  return games.filter(({ name }) =>
    name.toLowerCase().includes(filter.toLowerCase())
  );
};

const renderModalGames = (games, deckGames) => {
  const deckGamesId = new Set(deckGames.map(({ id }) => id));
  const gamesToShow = games.filter(({ id }) => !deckGamesId.has(id));
  gameDeck = gameDeckLayout({ games: gamesToShow, showDeleteIcon: false });
  if (gameDeck.length) {
    $(".search-modal-content > .search-deck-container").html(gameDeck);
    gamesToShow.forEach(({ id }) =>
      initialiseFlipper({ parentClass: "search-deck-container", gameId: id })
    );
  } else {
    $(".search-modal-content > .search-deck-container").html(
      "All games available are in the deck"
    );
  }
};

const filterModalGames = (games, query) => {
  return games.filter(({ name }) =>
    name.toLowerCase().includes(query.toLowerCase())
  );
};

const addAllToCart = async (games) => {
  const cartPayload = games.map(({ id, name, price, cover_image }) => ({
    id,
    name,
    price,
    url: `${baseUrl}/game-product/${id}`,
    image: cover_image,
  }));
  try {
    await Snipcart.api.cart.items.add(...cartPayload);
  } catch (error) {
    console.log(error);
  }
};

const renderDeck = async (decks, activeTabId) => {
  if (decks.length) {
    const {
      deckGameIcons,
      removed_games: removedGames,
      added_games: addedGames,
    } = decks?.find(({ id }) => id == activeTabId);

    deckGames = await getDeckGames({
      deckGameIcons,
      removedGames: removedGames?.filter((rg) => rg),
      addedGames: addedGames?.filter((ag) => ag),
    });
    showDeckGames(deckGames);
    return { deckLength: deckGames.length };
  } else {
    showDeckGames([]);
    return { deckLength: 0 };
  }
};

const refreshDeck = (updatedDeck, allDecks) => {
  const decks = allDecks.filter((deck) => deck.id !== updatedDeck.id);
  return [...decks, updatedDeck];
};
