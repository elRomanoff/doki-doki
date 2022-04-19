const dialog = `
    m "Hi again, [player]!"
    m "Glad to see you didn't run away on us. Hahaha!"
    mc "Nah, don't worry."
    mc "This might be a little strange for me, but I at least keep my word."
    show monika at thide zorder 1
    hide monika
    "Well, I'm back at the Literature Club."
    "I was the last to come in, so everyone else is already hanging out."
    show yuri 1a at t32 zorder 2
    y "Thanks for keeping your promise, [player]."
    y "I hope this isn't too overwhelming of a commitment for you."
    y 1u "Making you dive headfirst into literature when you're not accustomed to it..."
    show natsuki 4e at t33 zorder 2
    n "Oh, come on! Like he deserves any slack."
    n "Sayori told me you didn't even want to join any clubs this year."
    n "And last year, too!"
    n 4c "I don't know if you plan to just come here and hang out, or what..."
    n "But if you don't take us seriously, then you won't see the end of it."
    show monika 2b at l41
    m "Natsuki, you certainly have a big mouth for someone who keeps her manga collection in the clubroom."
    n 4o "M-M-M...!!"
    show monika at lhide
    hide monika
    "Natsuki finds herself stuck between saying \"Monika\" and \"Manga\"."
    show natsuki at h33
    n 1v "Manga is literature!!"
    show natsuki at thide zorder 1
    hide natsuki
    "Swiftly defeated, Natsuki plops back into her seat."
    show yuri at t22 zorder 2
    show sayori 2x at f21 zorder 3
    s "Don't worry, guys~"
    s "[player] always gives it his best as long as he's having fun."
    s "He helps me with busywork without me even asking."
    s "Like cooking, cleaning my room..."
    show sayori 2a at t21 zorder 2
    show yuri at f22 zorder 3
    y 2m "How dependable..."
    show yuri at t22 zorder 2
    mc "Sayori, that's because your room is so messy it's distracting."
    mc "And you almost set your house on fire once."
    show sayori at s21
    s 5 "Is that so... Ehehe..."
    show yuri at f22 zorder 3
    y 1s "You two are really good friends, aren't you?"
    y "I might be a little jealous..."
    show yuri at t22 zorder 2
    show sayori at f21 zorder 3
    s 1 "How come? You and [player] can become good friends too!"
    show sayori at t21 zorder 2
    show yuri at f22 zorder 3
    y 4b "U-Um..."
    show yuri at t22 zorder 2
    mc "S-Sayori--"
    show sayori at f21 zorder 3
    s "Hmm?"
    show sayori at t21 zorder 2
    mc "..."
    "As usual, Sayori seems oblivious to the weird situation she just put me into."
    show sayori at f21 zorder 3
    s 4x "Oh, oh! Yuri even brought you something today, you know~"
    show sayori at t21 zorder 2
    show yuri at f22 zorder 3
    y 3n "W-Wait! Sayori..."
    show yuri at t22 zorder 2
    mc "Eh? Me?"
    show yuri at f22 zorder 3
    y 3o "Um... Not really..."
    show yuri at t22 zorder 2
    show sayori at f21 zorder 3
    s 4r "Don't be shy~"
    show sayori at t21 zorder 2
    show yuri at f22 zorder 3
    y "It's really nothing..."
    show yuri at t22 zorder 2
    mc "What is it?"
    show yuri at f22 zorder 3
    y 4c "N-Never mind!"
    y "Sayori made it sound like a big deal when it's really not..."
    y "Uuuuh, what do I do..."
    show yuri at t22 zorder 2
    show sayori at f21 zorder 3
    s 1g "Eh? I'm sorry, Yuri, I wasn't thinking..."
    show sayori at thide zorder 1
    hide sayori
    show yuri at t11 zorder 2
    "I guess that means it's up to me to rescue this situation..."
    mc "Hey, don't worry about it."
    mc "First of all, I wasn't expecting anything in the first place."
    mc "So any nice gesture from you is a pleasant surprise."
    mc "It'll make me happy no matter what."
    y 3v "I-Is that so..."
    mc "Yeah. I won't make it a big deal if you don't want it to be."
    y "Alright..."
    y 1a "Well, here."
    "Yuri reaches into her bag and pulls out a book."
    y "I didn't want you to feel left out..."
    y "So I picked out a book that I thought you might enjoy."
    y "It's a short read, so it should keep your attention, even if you don't usually read."
    y "And we could, you know..."
    show yuri at sink
    y 4b "Discuss it...if you wanted..."
    "Th-This is..."
    "How is this girl accidentally being so cute?"
    "She even picked out a book she thinks I'll like, despite me not reading much..."
    mc "Yuri, thank you! I'll definitely read this!"
    "I enthusiastically take the book."
    show yuri 2m at t11 zorder 2
    y "Phew..."
    y 2a "Well, you can read it at your own pace."
    y "I look forward to hearing what you think."
    show yuri at thide zorder 1
    hide yuri
`
let j = 0;
let arrWords = [];
let wordmade = "";
let index = 0;
for (let i = 0; i < dialog.length; i++) {
    const element = dialog[i];
    
    if(element === '"') {
        for (let j = i + 1; j < dialog.length; j++) {
            const e = dialog[j];
            if(e !== '"'){
                wordmade = wordmade + e
            }
            else {
                arrWords.push(wordmade)
                wordmade = ""
                i = j + 1 
                break
            }
        }
    }   
}
const arrDialog = arrWords.map(x =>{
    if(x.includes("[player]")) {
        x.replace("[player]", "#var")
        return{
            usesVar: true,
            content:x,
        }
    }

    return {
        "content": x
    }
})
console.log(JSON.stringify(arrDialog))

