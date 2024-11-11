function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}

const formatDate = (date) => {
  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
  ].join("/");
};

const gameCardFlip = ({ games, showDeleteIcon = true }) => {
  return games.map((game) => {
    // const gameCard = `
    //   <div class="card-stacked" data-id=${game.id} data-name=${game.name}>
    //     <div class="card-item is-stacked"">
    //     <img class="card-item-img" src="${game.cover_image}" width="207" />
    //     </div>
    //     <div class="game-icon-circle is-cart">
    //       <div class="game-cart-icon w-embed"><svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
    //       <path d="M2.875 2.87506H4.19382C5.10005 2.87506 5.88168 3.51153 6.06529 4.39897L8.30971 15.247C8.49332 16.1344 9.27495 16.7709 10.1812 16.7709H16.7708" stroke="#FFEDC6" stroke-width="1.91111" stroke-linecap="round" stroke-linejoin="round"></path>
    //       <path d="M6.54004 6.70825H18.7994C19.4638 6.70825 19.9435 7.34416 19.761 7.98297L18.8302 11.2408C18.4622 12.5287 17.285 13.4166 15.9456 13.4166H7.93262" stroke="#FFEDC6" stroke-width="1.91111" stroke-linecap="round" stroke-linejoin="round"></path>
    //       <circle cx="15.8124" cy="19.6458" r="0.479167" fill="#FFEDC6" stroke="#FFEDC6" stroke-width="1.91111" stroke-linecap="round" stroke-linejoin="round"></circle>
    //       <circle r="0.479167" transform="matrix(1 0 0 -1 10.0627 19.6458)" fill="#FFEDC6" stroke="#FFEDC6" stroke-width="1.91111" stroke-linecap="round" stroke-linejoin="round"></circle>
    //     </svg></div>
    //     </div>
    //     <div class="game-icon-circle is-eye-icon">
    //       <div class="game-cart-icon w-embed"><svg width="23" height="17" viewBox="0 0 23 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    //       <path d="M11.4999 0.3125C6.70825 0.3125 2.61617 3.29292 0.958252 7.5C2.61617 11.7071 6.70825 14.6875 11.4999 14.6875C11.8449 14.6875 12.1899 14.6875 12.5349 14.6396C12.4856 14.3386 12.46 14.0342 12.4583 13.7292C12.4583 13.3842 12.4966 13.0392 12.5541 12.6942C12.2091 12.7325 11.8545 12.7708 11.4999 12.7708C7.89658 12.7708 4.62867 10.72 3.04742 7.5C3.822 5.91846 5.02475 4.58595 6.51896 3.65396C8.01317 2.72198 9.73888 2.2279 11.4999 2.2279C13.261 2.2279 14.9867 2.72198 16.4809 3.65396C17.9751 4.58595 19.1778 5.91846 19.9524 7.5C19.8374 7.73 19.7033 7.93125 19.5787 8.15167C20.2112 8.305 20.8149 8.56375 21.3612 8.9375C21.6199 8.45833 21.8499 7.97917 22.0416 7.5C20.3837 3.29292 16.2916 0.3125 11.4999 0.3125ZM11.4999 4.625C9.90908 4.625 8.62492 5.90917 8.62492 7.5C8.62492 9.09083 9.90908 10.375 11.4999 10.375C13.0908 10.375 14.3749 9.09083 14.3749 7.5C14.3749 5.90917 13.0908 4.625 11.4999 4.625ZM17.2499 10.375V12.2917H21.0833V14.2083H17.2499V16.125L14.3749 13.25L17.2499 10.375Z" fill="#FFEDC6"></path>
    //     </svg></div>
    //     </div>
    //     <div class="game-cart-check-container delete-game-icon">
    //       <div class="game-check-mark w-embed">
    //         <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="20px" height="20px"><path fill="#f44336" d="M36.021,8.444l3.536,3.536L11.98,39.557l-3.536-3.536L36.021,8.444z"/><path fill="#f44336" d="M39.555,36.023l-3.536,3.535L8.445,11.976l3.536-3.535L39.555,36.023z"/></svg>
    //       </div>
    //     </div>
    // `;
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
};

const getDeckGames = async ({
  deckGameIcons = [],
  removedGames,
  addedGames,
}) => {
  const query = deckGameIcons?.map(
    ({ state, icons_id }) =>
      `${state}_${state === "primary" ? "icon" : "icons"}=${icons_id}`
  );
  const queryString = query.length ? query.join("&") : "";
  try {
    const data = await fetch(`${baseUrl}/game-filter?${queryString}`);
    const games = await data.json();
    const allGames = [...games, ...(addedGames || [])];
    if (removedGames && removedGames.length) {
      const removedGamesIds = new Set(removedGames.map(({ id }) => id));
      const filteredGames = allGames.filter(
        ({ id }) => !removedGamesIds.has(id)
      );
      return filteredGames;
    }
    const gameSet = new Set();
    const deckGames = allGames.filter((game) => {
      if (gameSet.has(game.id)) {
        return false;
      } else {
        gameSet.add(game.id);
        return true;
      }
    });
    return deckGames;
  } catch (error) {
    console.log("get deck games error", error);
  }
};

const gameCardBack = (game) => {
  const centerIcon = game.icons?.find((icon) => {
    return icon.position === "center";
  })?.details;
  const rootIcon = game.icons?.find(
    (icon) => icon.position === "root"
  )?.details;
  const otherIcons =
    game.icons?.filter(
      (icon) => icon.position !== "center" && icon.position !== "root"
    ) || [];

  const gameBack = `
    <div class="game-card card-back">
      <div class="selection-card-icon center-icon">
        <img
          width="25px"
          height="25px"
          src="${centerIcon?.url}"
        />
      </div>
      <div class="selection-card-icon root-icon">
        ${
          rootIcon ? `<img width=25px height=25px src="${rootIcon?.url}"/>` : ""
        }
      </div>
      <div class="selection-card-icon top-icon">
        ${
          otherIcons[0]
            ? `<img width=25px height=25px src="${otherIcons[0]?.details?.url}"/>`
            : ""
        }
      </div>
      <div class="selection-card-icon top-right-icon">
        ${
          otherIcons[1]
            ? `<img width=25px height=25px src="${otherIcons[1]?.details?.url}"/>`
            : ""
        }
      </div>
      <div class="selection-card-icon top-left-icon">
        ${
          otherIcons[2]
            ? `<img width=25px height=25px src="${otherIcons[2]?.details?.url}"/>`
            : ""
        }
      </div>
    </div>
  `;
  return gameBack;
};

const gameCardFront = (game) => {
  const gameCard = `<div class="card-stacked" data-id="${game.id}" data-name="${game.name}">
      <div class="card-item is-stacked">
        <img class=" card-item-img" src="${game.cover_image}" width="207" />
      </div>
    </div>`;
  return gameCard;
};

const initialiseFlipper = ({ parentClass, gameId }) => {
  $(".prev").hide();
  const swiperEl = document.querySelector(
    `.${parentClass} .card-flip${gameId}`
  );
  const swiperParams = {
    slidesPerView: 1,
    effect: "flip",
    navigation: {
      nextEl: `.next${gameId}`,
      prevEl: `.prev${gameId}`,
    },
    on: {
      slidePrevTransitionEnd: function () {
        $(`.prev${gameId}`).hide();
        $(`.next${gameId}`).show();
      },
      slideNextTransitionEnd: () => {
        $(`.next${gameId}`).hide();
        $(`.prev${gameId}`).show();
      },
    },
  };

  // now we need to assign all parameters to Swiper element
  Object.assign(swiperEl, swiperParams);
  // and now initialize it
  swiperEl.initialize();
};

const deleteGameIcon = `<div class="game-cart-check-container delete-game-icon">
<div class="game-check-mark w-embed">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px"><path fill="#f44336" d="M36.021,8.444l3.536,3.536L11.98,39.557l-3.536-3.536L36.021,8.444z"/><path fill="#f44336" d="M39.555,36.023l-3.536,3.535L8.445,11.976l3.536-3.535L39.555,36.023z"/></svg>
</div>
</div>`;

const gameCartIcon = (game, productUrl) => {
  return `<div class="game-icon-circle is-cart">
  <div class="snipcart-add-item game-cart-icon w-embed" data-item-id=${game.id} data-item-price=${game.price}
  data-item-url=${productUrl} data-item-description=${game.description}
  data-item-image=${game.cover_image} data-item-name=${game.name} data-item-max-quantity=1><svg width="23" height="23" viewBox="0 0 23 23" fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.875 2.87506H4.19382C5.10005 2.87506 5.88168 3.51153 6.06529 4.39897L8.30971 15.247C8.49332 16.1344 9.27495 16.7709 10.1812 16.7709H16.7708"
        stroke="#FFEDC6" stroke-width="1.91111" stroke-linecap="round" stroke-linejoin="round"></path>
      <path
        d="M6.54004 6.70825H18.7994C19.4638 6.70825 19.9435 7.34416 19.761 7.98297L18.8302 11.2408C18.4622 12.5287 17.285 13.4166 15.9456 13.4166H7.93262"
        stroke="#FFEDC6" stroke-width="1.91111" stroke-linecap="round" stroke-linejoin="round"></path>
      <circle cx="15.8124" cy="19.6458" r="0.479167" fill="#FFEDC6" stroke="#FFEDC6" stroke-width="1.91111"
        stroke-linecap="round" stroke-linejoin="round"></circle>
      <circle r="0.479167" transform="matrix(1 0 0 -1 10.0627 19.6458)" fill="#FFEDC6" stroke="#FFEDC6"
        stroke-width="1.91111" stroke-linecap="round" stroke-linejoin="round"></circle>
    </svg></div>
</div>`;
};
