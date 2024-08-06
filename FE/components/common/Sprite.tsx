// import React, { useState, useEffect } from "react";
// import "./Sprite.css"; // We'll create this next
// import heroSprite from "../../src/assets/isometric-hero";

// const Sprite = ({ x, y, frame, direction }) => {
//   const spriteSize = 128; // Each frame is 128x128px
//   const spriteSheetWidth = 1024; // 8 directions * 128px

//   return (
//     <div
//       style={{
//         position: "absolute",
//         left: `${x}px`,
//         top: `${y}px`,
//         width: `${spriteSize}px`,
//         height: `${spriteSize}px`,
//         backgroundImage: `url(${heroSprite})`,
//         backgroundPosition: `-${frame * spriteSize}px -${direction * spriteSize}px`,
//         transform: "translate(-50%, -50%)", // Center the sprite on its position
//       }}
//     />
//   );
// };

// export default Sprite;
