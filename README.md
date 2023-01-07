# mtml
Minimum Text Markup Language simplifies &lt;>&lt;/> based languages.

Here is how you write it:

```
div:
  p:
    "This is a paragraph inside a div.
  p:
    'As you can see, indentation is important (it should be tabs), you write the content inside of it by putting " or ' after the :
    div: 'But you can write it on the same line too (I don't like it, but hey, why not?).


      inventedTag class="this-is-a-example-of-how-you-can-pass-parameters-to-a-tag:
        'the only thing you should be aware of is not to mess = and : up
        'You don't need to pass the content all in the same line (though the parser will read it as if it was), just keep putting 'at the
        'begining and you'll be ready to go. Want to actually render ' at the begining? Just write '' instead of '.

        ifYouDontWannaCloseATag justDont="put_the_:_at_the_end"

        You don't need to put all tag parameters into a single line either, as long as you DON'T put ' at the begining,
        You'll be ready to go - Disclaimer: writing like this will transform new lines into spaces, don't want that? same old \ .

```

Now, let's compare this example with what it would be with <> notations (and some comments in (())double parenthesis):

```
<div>
  <p>
    This is a paragraph inside a div.</p>

  <p>
    As you can see, indentation is important (it should be tabs), you write the content inside of it by putting " or ' after the :</p> ((not here)).
  <div> But you can write it on the same line too (I don't like it, but hey, why not?) ((I won't do this here 'cause you'll be lost))

    <inventedTag class="this-is-a-example-of-how-you-can-pass-parameters-to-a-tag>
      the only thing you should be aware of is not to mess = and : up ((same))
      You don't need to pass the content all in the same line (though the parser will read it as if it was),((same)) just keep putting 'at the
      begining and you'll be ready to go. Want to actually render ' at the begining? Just write '' instead of '.(not here)

      <ifYouDontWannaCloseATag justDont="put_the_:_at_the_end">(not here)
    
    You don't need to put all tag parameters into a single line either((same)), as long as you DON'T put ' at the begining,((not here))
    You'll be ready to go - Disclaimer: writing like this will transform new lines into spaces, don't want that? same old \(same, I think?)
  </inventedTag>
  </div>
</div>

```
I've had this idea while being once again unable to sleep.

So that's it, I think it simplifies a lot and it comunicates better - I mean, is just like some programing languages.

As I've had the idea, I should also create the parser that will output it as a <> language so you can use it like so.

I do think markdown also translates well into html, but it has some caveats.
