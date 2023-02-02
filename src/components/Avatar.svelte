<script>

    export let user;

    $: name = getname(user);
    $: color = getcolor(user);

    function getname(user) {
        return (user.username || '?')
            .trim()
            .split(/\s+/)
            .slice(0,2)
            .map(word => word[0].toUpperCase())
            .join('');
    }

    function getcolor(user) {
        if(user.color) {
            let {r,g,b} = user.color;
            return [r,g,b].join(',');
        }
        return '50,50,50';
    }

</script>


<div style="background-color:rgb({color});">
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

