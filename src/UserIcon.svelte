<script>

    export let user;

    import {colors} from './lib/colors.js';

    let {r,g,b} = colors[Math.floor(Math.random()*colors.length)];

    let name = user.split(/\s+/).slice(0,2).map(x => x[0].toUpperCase());

</script>

<div style="background-color:rgb({r},{g},{b});">
    {name}
</div>

<style>
    div {
        box-sizing:border-box;
        display:inline-block;
        width:50px;
        height:50px;
        font-size:24px;
        font-weight:bold;
        color: rgba(0,0,0,0.85);
        line-height:24px;
        padding:13px 0;
        text-align:center;
        border-radius:100%;
    }
</style>

