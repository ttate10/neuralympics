<script lang="ts">
    import { createEventDispatcher } from "svelte";
    export let label;
    export let fontSize = 16;

    export let checked = true;

    const dispatch = createEventDispatcher<{ toggle: { checked: boolean } }>();

    const uniqueID = Math.floor(Math.random() * 100);

    function handleClick() {
        checked = !checked;
        dispatch("toggle", { checked });
    }
</script>

<div class="slider" style="font-size:{fontSize}px">
    <span id={`switch-${uniqueID}`}>{label}</span>
    <button
        role="switch"
        aria-checked={checked}
        aria-labelledby={`switch-${uniqueID}`}
        on:click={handleClick}
        on:change
    />
</div>

<style>
    :root {
        --accent-color: CornflowerBlue;
        --gray: #ccc;
    }

    .slider {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .slider button {
        width: 3em;
        height: 1.6em;
        position: relative;
        margin: 0 0 0 0.5em;
        background: var(--gray);
        border: none;
    }

    .slider button::before {
        content: "";
        position: absolute;
        width: 1.3em;
        height: 1.3em;
        background: #fff;
        top: 0.13em;
        right: 1.5em;
        transition: transform 0.3s;
    }

    .slider button[aria-checked="true"] {
        background-color: var(--accent-color);
    }

    .slider button[aria-checked="true"]::before {
        transform: translateX(1.3em);
        transition: transform 0.3s;
    }

    .slider button:focus {
        box-shadow: 0 0px 0px 1px var(--accent-color);
    }

    .slider button {
        border-radius: 1.5em;
    }

    .slider button::before {
        border-radius: 100%;
    }

    .slider button:focus {
        box-shadow: 0 0px 8px var(--accent-color);
        border-radius: 1.5em;
    }
</style>
