$(document).ready(async () => {
  $(".add-to-collection-list").on("click", ".deck-option", async (e) => {
    const searchParams = new URLSearchParams(window.location.search);
    const gameId = searchParams.get("gameId");
    const deckId = $(e.currentTarget).attr("data-deck-id");
    await updateDeck({ added_games: [gameId] }, deckId);
  });
});

const initialiseSlider = () => {
  const thumbnailSlider = document.querySelector(".video-thumbnails");
  const swiperParams = {
    direction: "vertical",
    spaceBetween: 10,
    loop: true,
    height: 50,
    navigation: {
      nextEl: ".thumbnail-down",
      prevEl: ".thumbnail-up",
    },
  };
  Object.assign(thumbnailSlider, swiperParams);
  thumbnailSlider.initialize();
};

const setGameInfo = async () => {
  const params = new URLSearchParams(document.location.search);
  const gameId = params.get("gameId");
  const game = await getGame(gameId);
  const {
    name,
    id,
    description,
    cover_image,
    system_requirements,
    developer,
    publisher,
    release_date,
    icons_id,
    price,
  } = game;
  $(".game-header-title h2").html(`${name}: ${description}`);
  $(".game-image-container img").attr("src", cover_image);
  $(".game-description-content").html(description);
  const requirementNodes = displayRequirements(system_requirements);
  $(".system-requirements > .game-details").html(requirementNodes);
  $(".game-publisher").html(publisher);
  $(".game-developer").html(developer);
  $(".game-release-date").html(formatDate(new Date(release_date)));
  const icons = rendergameIcons(icons_id);
  $(".game-header-title > .card-icons-wrapper").html(icons);
  const relatedGames = await getRelatedGames(id);
  showRelatedGames(relatedGames);
  $(".related-games-title").html(`More games from ${developer}`);
  relatedGames.forEach((game) => {
    initialiseFlipper({ parentClass: "related-games", gameId: game.id });
  });

  const productUrl = `${baseUrl}/game-product/${game.id}`;
  $(".add-single-game-to-cart").attr("data-item-id", id);
  $(".add-single-game-to-cart").attr("data-item-price", price);
  $(".add-single-game-to-cart").attr("data-item-description", description);
  $(".add-single-game-to-cart").attr("data-item-name", name);
  $(".add-single-game-to-cart").attr("data-item-max-quantity", 1);
  $(".add-single-game-to-cart").attr("data-item-image", cover_image);
  $(".add-single-game-to-cart").attr("data-item-url", productUrl);
  return game;
};

const renderDeckOptionList = (decks) => {
  const deckList = decks.map((deck) => {
    const optionEl = `<div class="deck-option" data-deck-id="${deck.id}">${deck.name}</div>`;
    return optionEl;
  });
  $(".add-to-collection-list").html(deckList.join(""));
};

const rendergameIcons = (icons) => {
  return icons
    ?.map(({ url, name }) => {
      return `<div class="genre-item bcg-black"><img src="${url}" loading="lazy" alt="${name} width="30px" height="30px" "></div>`;
    })
    .join("");
};

const getGame = async (id) => {
  try {
    const response = await fetch(`${baseUrl}/game/${id}`, {
      headers: {
        Authorization: sessionStorage.getItem("token"),
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getRelatedGames = async (id) => {
  try {
    const response = await fetch(`${baseUrl}/game/${id}/related`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const displayRequirements = (requirements) => {
  const reqEl = [];
  for (let key in requirements) {
    reqEl.push(
      `<div class="game-detail-title system-requirements">
        <div class="game-detail-circle"></div>
        <div>
          <p class="p-small">${titleCase(key)} : ${requirements[key]}</p>
        </div>
      </div>`
    );
  }
  return reqEl.join("");
};

const showRelatedGames = (games) => {
  // const gameCards = createGameCards(games);
  const gameCards = gameCardFlip({ games, showDeleteIcon: false });
  $(".related-games").html(gameCards.join(""));
};

const titleCase = (s) => {
  return s
    .replace(/([^A-Z])([A-Z])/g, "$1 $2") // split cameCase
    .replace(/[_\-]+/g, " ") // split snake_case and lisp-case
    .toLowerCase()
    .replace(/(^\w|\b\w)/g, function (m) {
      return m.toUpperCase();
    }) // title case words
    .replace(/\s+/g, " ") // collapse repeated whitespace
    .replace(/^\s+|\s+$/, ""); // remove leading/trailing whitespace
};

const observeModal = (element, callback) => {
  var options = {
    root: document.documentElement,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      callback(entry.intersectionRatio > 0);
    });
  }, options);

  observer.observe(element);
};

const setUpBannerSlides = (game) => {
  const imageThumbs = game.assets.map(({ type, thumbnail, url }) => {
    return `
      <swiper-slide class="banner-thumb" data-type=${type} data-src=${url}>
          <a href="#" class="video-link w-inline-block">
            <img src=${
              thumbnail || url
            } loading="lazy" alt="" width="50px" height="50px">
          </a>
        </swiper-slide>
      `;
  });
  $(".video-thumbnails").html(imageThumbs.join(""));
  return game.assets;
};

const setBannerSlide = ({ type, src }) => {
  if (type === "video") {
    const vidEl = `
      <video width="400" preload="metadata" controls autoplay style="width:100%">
        <source src=${src}>
      </video>
    `;
    $(".banner-video").html(vidEl);
    $(".banner-video").css("display", "block");
  } else {
    const bannerVid = $(".banner-video video").get(0);
    if (bannerVid) {
      bannerVid.pause();
    }
    $(".game-video-placeholder").css(
      "background-image",
      "linear-gradient(to bottom, rgba(0, 0, 0, 0), var(--black)), url(" +
        src +
        ")"
    );
    $(".banner-video").css("display", "none");
  }
  $(".game-video-placeholder").css(
    "background-image",
    "linear-gradient(to bottom, rgba(0, 0, 0, 0), var(--black)), url(" +
      src +
      ")"
  );
};

const renderGameModalContent = async ({ addableDecks }) => {
  renderDeckOptionList(addableDecks);
  const game = await setGameInfo();
  initialiseSlider();
  const gameAssets = setUpBannerSlides(game);
  if (gameAssets.length) {
    setBannerSlide({ type: gameAssets[0].type, src: gameAssets[0].url });
  }
};
