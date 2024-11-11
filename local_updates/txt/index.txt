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
      window.location.href = window.location.origin + "/deck";
      $(".auth-btn").css("display", "none");
      $(".logout-btn").css("display", "block");
    } catch (error) {
      console.log("Error completing authorization: ", error);
    }
  }

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
    generateStack(featuredDeckGames, swiper);
  } else {
    const decksWithGames = await getUserDecks();
    generateStack(decksWithGames, swiper);
  }
  await generateHomeGameCards();
  generateNavBarDecks(featuredDecks);
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

const generateStack = (decksWithGames, swiper) => {
  swiper.removeAllSlides();
  decksWithGames.map(({ deck, deckGames }) => {
    const card1 = `
    <div class="deck-info-card stack-card card-1">
      <div>${deck.name}</div>
      <div></div>
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
