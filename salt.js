import bcrypt from "bcrypt";

const pass = "password123";

const main = async () => {
  // generating salt, number of rounds (iterations) is 16, safe number is 10+
  const salt1 = bcrypt.genSaltSync(16);
  const salt2 = bcrypt.genSaltSync(16);

  // hashing password with salt
  const hash1 = await bcrypt.hash(pass, salt1);

  // hashing password with salt
  const hash2 = await bcrypt.hash(pass, salt2);

  /*   console.log(`salt1 => ${salt1}`);
  console.log(`salt2 => ${salt2}`);
  console.log(`hash1 => ${hash1}`);
  console.log(`hash2 => ${hash2}`); */

  await verify(pass, hash2);
  await verify(`password321`, hash2);
};

const verify = async (pass, hash) => {
  const ourSalt = hash.slice(0, 29);
  console.log(`ourSalt => ${ourSalt}`);

  const hashCompare = await bcrypt.hash(pass, ourSalt);

  console.log(`${hash} => hashCompare:  ${hash === hashCompare}`);
};

main();

// $2b$16$wjVRQTnDceDzgvk5q4qSTe => $2b$ - bcrypt version, 16$ - number of rounds, wjVRQTnDceDzgvk5q4qSTe - salt
// podwojne hashowanie jest aktualnie zbedne i spowalnia dzialanie aplikacji
// nigdy nie wolno zapisywac hasla w czystej postaci (plain text) - bardzo niebezpieczne
