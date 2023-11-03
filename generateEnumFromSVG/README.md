# Generate an enum object from a folder of svg's


This is a extremely basic script for converting a large set of SVG's into a typescript `enum` object.

**For example:**

Say you had a folder containing the following files:
```
chat-bubble-large.svg
chat-bubble-small.svg
checkmark-large.svg
checkmark-small.svg
```
and so on...

you would run this python script in that folder and it would output a `.txt` file for you containing the following:

```typescript
{
  CHAT_BUBBLE_LARGE = 'chat-bubble-large',
  CHAT_BUBBLE_SMALL = 'chat-bubble-small',
  CHECKMARK_LARGE = 'checkmark-large',
  CHECKMARK_SMALL = 'checkmark-small',
}
```
