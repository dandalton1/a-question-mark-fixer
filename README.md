# a-question-mark-fixer
A short web dev script that fixes the iOS "A [?]" bug.

# What is the bug?
When users typed a lowercase `i`, rather than making a capital `I`, iOS 11.1 would produce the letter `A` with a glitchy character represented by a questionmark in a box.

Research on strings produced with this bug gives the buggy string the four byte codepoint of `0049 FE0F`. `0049` is the codepoint for the capital `I` (as expected), but `FE0F` is the codepoint for the 15th Unicode variance selector (`FE00-FE15` is reserved for this purpose.

# Why does it turn into an A and a questionmark?

My hypothesis is iOS, somewhere, sets the fifth bit of each byte in the Unicode string to `0`, causing the code sequence to change to `0041 F607`. `0041` is the character sequence for `A`, and `F607` is a private use Unicode character rendering as a questionmark. It's a character that shouldn't be rendered.

# The fix

As a hex analysis for the string will allow us to see the codepoint for `I` and an extranneous `FE0F` character, the solution is to simply strip that `FE0F` character from an afflicted string.

This solution is a simple regular expression string replacement. In JavaScript, this can be done with `str.replace(/\uFEOF/g, "");`, but this can even be done with something as simple as bash with `sed s/\uFE0F//g'.` Essentially, replacing `FE0F` with a null string (`""`), or removing all instances of `FE0F`, makes the string filtered out and provides a fix.

Within the repo, there's a simple online tool that fixes this character bug. This could be very easily implemented in a server side script. However, this doesn't account for the special case of Emojis or character glyphs in languages other than English, where variance selectors may be needed.

This script could be adapted, on either client or server side, to:
- Ignore emoji codepoints
- Only filter out if the preceding character is `I`
- Ignore all characters that shouldn't render
