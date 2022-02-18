import { Router } from "express";
import { Request, Response } from "express";

const home: Router = Router();

// API Home Page
home.get("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const title = "Cortex API";
    res.status(200).send(
      `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta http-equiv="X-UA-Compatible" content="IE=edge" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@800&display=swap" rel="stylesheet"/><link rel="icon" href="https://crew-grievances.vercel.app/static/media/pattarai-shine.91c8a0a1.gif" type="image/gif" sizes="16x16" />
            <title>Pattarai | ${title}</title>
            <style> * {margin: 0;padding: 0;box-sizing: border-box;}body {font-family: Montserrat;color: white; background: #0f1118; }main {height: 90vh;display: flex; flex-direction: column;justify-content: center;align-items: center;}img {height: 30rem;width: 30rem;}h1 {letter-spacing: 5px;font-size: 50px;}@media (max-width: 600px) {img { height: 15rem;width: 15rem;}h1 {font-size: 30px;}}</style>
          </head>
          <body><main>
              <img src="https://crew-grievances.vercel.app/static/media/pattarai-shine.91c8a0a1.gif"/>
              <h1>${title}</h1>
            </main>
          </body>
        </html>`
    );
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.toString(),
    });
  }
});

export default home;
