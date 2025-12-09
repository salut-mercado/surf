import { createReceipt } from "./ireceipt";

export const testReceipt = createReceipt<{
  items: { name: string; quantity: number; price: number }[];
  cash: number;
}>(async (data) => {
  const { items } = data;
  const total = items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const EXAMPLE_RECEIPT = `{image:iVBORw0KGgoAAAANSUhEUgAAAQAAAAA8AgMAAAD004yXAAAACVBMVEVwAJsAAAD///+esS7BAAAAAXRSTlMAQObYZgAAAZtJREFUSMftlkGOwyAMRW0J76kE97GlZu9KcP+rzCekKak6bWdGmrZS6KIG/7yAbQhEe+tN6qUpDZ1KPHT8SnhpeaP6FlA2wicBsgOeBpTF6gDfZHgj9Jt1sAMeAYYE/RFQngYMuX49gD8fMObjkwB+++h+DeB3x/qdvfD/AP4QwPXX+ceAUdV6Y7K/3Vr7rWhv73ZN9XVHzOUdlm6v9ay3pM1eLT+Ppv63BWjz8jJU0vpUWgGs5yfihrN451G+lq7i2bkF8Bagw3Qv0hEQKGTPPjnGxJtZrSIcJy5ciJ3JStbarjrgwOtVK7Z1iLFOOgOSR3WstTqMqCcVFlITDnhhNhMKzJNIA3iEBr1uaAfArA7bSWdAkRrIsJSMrwXbJBowEhogwe9F+NilC8D1oIyg43fA+1WwKpoktXUmsiOCjxFMR+gEBfwcaJ7qDBBWNTVSxKsZZhwkUgkppEiJ1VOIQdCFtAmNBQg9QWj9POQWFW4Bh0HVipRIHlpEUVzUAmslpgQpVcS0SklcrBqf03u/UvVhLd8H5Hffil/ia4Io3warBgAAAABJRU5ErkJggg==}

Ichigaya Terminal
1-Y-X Kudan, Chiyoda-ku
-------------------------------------
03-18-2024 12:34
{border:line}
^RECEIPT
{border:space}
{width:*,2,10}
${items.map((item) => `${item.name}              | ${item.quantity}|     ${item.price}`).join("\n")}
-------------------------------------
{width:*,20}
^TOTAL             |           ^${total}
CASH               |            ^${data.cash}
CHANGE             |            ^${data.cash - total}
{code:20240318123456;option:code128,48}`;
  return EXAMPLE_RECEIPT;
});
