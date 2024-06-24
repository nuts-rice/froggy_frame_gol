import { Button, Frog, TextInput, parseEther } from "frog";

import Grid from "../components/Grid";
import Card from "../components/Card";

export const app = new Frog<HonoEnv>({});

app.image("/init_img", (c) => {
  return c.res({
    image: (
      <>
        <Card>
          <Grid>
            <g strokeWidth="1.25" stroke="hsla(0, 0%, 11%, 1.00)" fill="white">
              {new Array(20).fill(null).map((_, i) => {
                return (
                  <g key={i}>
                    {new Array(20).fill(null).map((_, j) => {
                      return (
                        <rect
                          key={j}
                          x={20 * j}
                          y={20 * i}
                          width={20}
                          height={20}
                          fill={"white"}
                        />
                      );
                    })}
                  </g>
                );
              })}
            </g>
          </Grid>
        </Card>
      </>
    ),
  });
});
