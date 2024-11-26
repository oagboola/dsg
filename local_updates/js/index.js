$(document).ready(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const authCode = urlParams.get("code");
  if (authCode) {
    try {
      const response = await fetch(
        `https://mycorrhizal.deepseedgames.com/api:Ys-isoaj/oauth/auth0/continue?code=${authCode}&redirect_uri=https://game-studio-dev-a7bd8bbd33a43816c858767.webflow.io`
      );
      const data = await response.json();
      sessionStorage.setItem("token", data.token);
      // window.history.pushState({}, "", window.location.origin + '/create-a-deck'); // ckear code from url
      window.location.href = window.location.origin;
      $(".auth-btn").css("display", "none");
      $(".logout-btn").css("display", "block");
    } catch (error) {
      console.log("Error completing authorization: ", error);
    }
  }
  $(".stack-slider").on("click", ".deck-info-card", (e) => {
    const deckId = $(e.currentTarget).attr("data-deck-id");
    const isFeatured = $(e.currentTarget).attr("data-isFeatured");
    sessionStorage.setItem("clickedDeck", deckId);
    if (!isFeatured || isFeatured == "false") {
      window.location.href = window.location.origin + "/deck";
    } else {
      window.location.href = window.location.origin + "/featured-deck";
    }
  });

  var swiper = new Swiper(".stack-slider", {
    // Optional parameters
    direction: "horizontal",
    loop: false,
    slidesPerView: 5,
    slidesPerView: "auto",
    centeredSlides: false,
    spaceBetween: 20,
    navigation: {
      nextEl: ".home-slide-next",
      prevEl: ".home-slide-prev",
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      // when window width is >= 480px
      480: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      // when window width is >= 640px
      640: {
        slidesPerView: 4,
        spaceBetween: 40,
      },
      990: {
        slidesPerView: 5,
        spaceBetween: 40,
      },
      1200: {
        slidesPerView: 5,
        spaceBetween: 40,
      },
      1400: {
        slidesPerView: 5,
        spaceBetween: 40,
      },
    },
  });
  await getUser();
  const featuredDecks = await listFeaturedDecks();
  if (sessionStorage.getItem("isLoggedIn") == "false") {
    const featuredDeckGames = await Promise.all(
      featuredDecks.map(async (deck) => {
        const { deckGameIcons, removed_games, added_games } = deck;
        const deckGames = await getDeckGames({
          deckGameIcons,
          removedGames: removed_games,
          addedGames: added_games,
        });
        return { deck, deckGames };
      })
    );
    generateStack(featuredDeckGames, swiper, true);
  } else {
    const decksWithGames = await getUserDecks();
    generateStack(decksWithGames, swiper, false);
  }
  await generateHomeGameCards();
  generateNavBarDecks(featuredDecks);

  // render game modal
  $(".stack-card").click(async (e) => {
    const gameId = $(e.currentTarget).attr("data-id");
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
    // const otherDecks = allDecks.filter((deck) => deck.id != currentDeckId);
    await renderGameModalContent({ addableDecks: [] });
  });
});

const getUserDecks = async () => {
  try {
    const decks = await listDecks();
    return Promise.all(
      decks.map(async (deck) => {
        const { deckGameIcons, removed_games, added_games } = deck;
        const deckGames = await getDeckGames({
          deckGameIcons,
          removedGames: removed_games,
          addedGames: added_games,
        });
        return { deck, deckGames };
      })
    );
  } catch (error) {
    console.log("error", error);
  }
};

const homeCardStack = (game) => {
  return gameCardFront(game);
};

const generateStack = (decksWithGames, swiper, isFeatured) => {
  swiper.removeAllSlides();
  decksWithGames.map(({ deck, deckGames }) => {
    const { featuredDeckIcons, deckGameIcons } = deck;
    const deckIconsList =
      featuredDeckIcons ||
      deckGameIcons?.map(({ iconDetail, state }) => ({
        url: iconDetail.url,
        state,
      }));
    const deckIcons = deckIconsList?.map(
      (icon) =>
        `<img width="25px" height="25px" src="${
          icon.url
        }" style="background-color:${
          icon.state === "exclude"
            ? "red"
            : icon.state === "include"
            ? "green"
            : "blue"
        }; margin:1px; border-radius:50%"/>`
    );
    const card1 = `
    <div class="deck-info-card stack-card card-1" data-deck-id=${
      deck.id
    } data-isFeatured=${isFeatured}>
      <div>${deck.name} (${deckGames.length})</div>
      <div>${deckIcons?.join("")}</div>
    </div>`;
    const otherCards = deckGames
      .slice(0, 4)
      .map((game, i) =>
        $(homeCardStack(game))
          .first()
          .attr("class", `stack-card card-${i + 2}`)
          .prop("outerHTML")
      )
      .join("");
    const stackSlide = `
  <div class="swiper-slide">
    <div class="stack">
      ${card1}
      ${otherCards}
    </div>
  </div>
`;
    swiper.appendSlide(stackSlide);
  });
};

const listFeaturedDecks = async () => {
  return getFeaturedDecks();
};

const listFeaturedGames = async () => {
  const featuredGames = await getFeaturedGames();
  return featuredGames.map(({ icons_id, ...rest }) => ({
    ...rest,
    icons: icons_id,
  }));
};

const generateHomeGameCards = async () => {
  const homeGames = await listFeaturedGames();
  const gameCards = gameCardFlip({
    games: homeGames.map(({ icons, ...rest }) => ({
      ...rest,
      icons: [...icons.reduce((acc, icon) => [...acc, ...icon], [])],
    })),
    showDeleteIcon: false,
  });
  $(".featured-games").html(gameCards.join(""));
  homeGames.forEach((game) => {
    initialiseFlipper({ parentClass: "featured-games", gameId: game.id });
  });
};

const generateNavBarDecks = (decks) => {
  // nav-sidebar-container
  decks.map(
    (deck) => `
    <div class="card-item navbar-card"><img src="images/Rectangle-2312-1.jpg" loading="lazy" width="207" alt="" class="card-item-img is-hidden">
      <div class="card-bototm-img-container"><img src="images/Group-186-2.png" loading="lazy" alt="" class="card-bottom-img background-black"></div>
    </div>
  `
  );
  const navBarDecks = `<div class="card-item navbar-card"><img src="images/Rectangle-2312-1.jpg" loading="lazy" width="207" alt=""
            class="card-item-img is-hidden">
          <div class="card-bototm-img-container"><img src="images/Group-186-2.png" loading="lazy" alt=""
              class="card-bottom-img background-black"></div>
        </div>`;
  $(".nav-sidebar-container").html(navBarDecks);
};
