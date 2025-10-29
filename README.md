# Upload, Play, and Reverse Audio

## Goals

1. Upload an audio file and decode it into an audio buffer.
2. Play that audio buffer back.
3. Reverse that audio buffer for reverse playback.

---

## Steps

### 1. Define three functions

We need three functions. Define them all with empty code:

```js
const loadAndDecode = async function (event){}
const playBuffer = function(){}
const revAudioBuffer = function() {}
```

---

### 2. Add event listeners

We will need to call those functions from event listeners:

```js
document.querySelector("#fileUpload").addEventListener("change", loadAndDecode);
document.querySelector("#reverse").addEventListener("click", revAudioBuffer);
document.querySelector("#play").addEventListener("click", playBuffer);
```

---

### 3. The `loadAndDecode` function

We’re no longer using `fetch`. The file is passed to the function from the `event` object as an array, so we want to get index `0` from that array:

```js
const loadAndDecode = async function (event){
    let file = event.target.files[0];  
    let arraybuf = await file.arrayBuffer();  
    audiobuffer = await ctx.decodeAudioData(arraybuf);  
}
```

---

### 4. The `playBuffer` function

This is similar to before, but we’ll use a separate button to avoid uploading and decoding the audio file every time we want to play it back:

```js
const playBuffer = function(){
    sourceNode = new AudioBufferSourceNode(ctx, {buffer: audiobuffer});  
    sourceNode.connect(gain);  
    sourceNode.start();  
}
```

Let’s avoid possible errors, such as clicking Play before loading a file:

```js
const playBuffer = function(){  
    if (audiobuffer){  
        sourceNode = new AudioBufferSourceNode(ctx, {buffer: audiobuffer});  
        sourceNode.connect(gain);  
        sourceNode.start();  
    } else {  
        alert("Please upload an audio file.");  
    }  
}
```

Or if there’s already a file playing:

```js
const playBuffer = function(){  
    if (audiobuffer){  
        if (!sourceNode){  
            sourceNode = new AudioBufferSourceNode(ctx, {buffer: audiobuffer});  
            sourceNode.connect(gain);  
            sourceNode.start();  
        } else {  
            alert("Audio file already playing.");  
        }  
    } else {  
        alert("Please upload an audio file.");  
    }  
}
```

To make this work fully, we need to delete `sourceNode` after it finishes.
This is also good for memory management.
We use the `.onended` property:

```js
const playBuffer = function(){  
    if (audiobuffer){  
        if (!sourceNode){  
            sourceNode = new AudioBufferSourceNode(ctx, {buffer: audiobuffer});  
            sourceNode.onended = ()=>{  
                sourceNode.disconnect();  
                sourceNode = null;  
            }  
            sourceNode.connect(gain);  
            sourceNode.start();  
        } else {  
            alert("Audio file already playing.");  
        }  
    } else {  
        alert("Please upload an audio file.");  
    }  
}
```

---

### 5. The `revAudioBuffer` function

Now we want to reverse the audio data in the `audioBuffer`.
We’ll do this in three steps for each channel of audio:

1. Extract the data with the `.getChannelData()` method to return a `Float32Array`.
2. Run the `.reverse()` method on that array.
3. Copy that reversed array back to the same channel on the `audioBuffer`.

```js
const revAudioBuffer = function(){
    let ch = 0;
    let revData = audiobuffer.getChannelData(ch).reverse();  
    audiobuffer.copyToChannel(revData, ch);  
}
```

To make sure it happens on all channels, no matter how many there are, use a `for` loop:

```js
const revAudioBuffer = function(){
    for (let ch = 0; ch < audiobuffer.numberOfChannels; ch++){  
        let revData = audiobuffer.getChannelData(ch).reverse();  
        audiobuffer.copyToChannel(revData, ch);  
    }
}
```

---

## Finished Code

```js
const loadAndDecode = async function (event){
    let file = event.target.files[0];  
    let arraybuf = await file.arrayBuffer();  
    audiobuffer = await ctx.decodeAudioData(arraybuf);  
}

const playBuffer = function(){  
    if (audiobuffer){  
        if (!sourceNode){  
            sourceNode = new AudioBufferSourceNode(ctx, {buffer: audiobuffer});  
            sourceNode.onended = ()=>{  
                sourceNode.disconnect();  
                sourceNode = null;  
            }  
            sourceNode.connect(gain);  
            sourceNode.start();  
        } else {  
            alert("Audio file already playing.");  
        }  
    } else {  
        alert("Please upload an audio file.");  
    }  
}

const revAudioBuffer = function(){
    for (let ch = 0; ch < audiobuffer.numberOfChannels; ch++){  
        let revData = audiobuffer.getChannelData(ch).reverse();  
        audiobuffer.copyToChannel(revData, ch);  
    }
} 

document.querySelector("#fileUpload").addEventListener("change", loadAndDecode);
document.querySelector("#play").addEventListener("click", playBuffer); 
document.querySelector("#reverse").addEventListener("click", revAudioBuffer);
```

---

**Summary**

* You can now upload, play, and reverse any audio file.
* Always create a new `AudioBufferSourceNode` each time you play.
* Reversing is destructive — you can click Reverse again to flip it back.
